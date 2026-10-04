import { localRequest } from "../utils/localPersistence";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cloneData } from '../utils/layout';
import { presentationData } from '../data/presentationData';
import { downloadFile, safeFilename, validatePresentation } from '../utils/presentationFile';
import { exportPortable } from '../utils/portableExport';

const STORAGE_KEY = 'ahm-premium-presentation-data';
const SIGNAL_KEY = `${STORAGE_KEY}-signal`;
const SAVE_EVENT = `${STORAGE_KEY}-saved`;

function indexedData(mode, data) {
  return new Promise((resolve, reject) => {
    let finished = false;
    const finish = (error, value) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      error ? reject(error) : resolve(value);
    };
    const timer = setTimeout(() => finish(new Error('Browser backup is unavailable.')), 8000);
    let request;
    try { request = indexedDB.open('ahm-premium-presentation-db', 1); }
    catch (error) { finish(error); return; }
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains('presentation')) request.result.createObjectStore('presentation');
    };
    request.onerror = () => finish(request.error);
    request.onsuccess = () => {
      const db = request.result;
      if (finished) { db.close(); return; }
      try {
        const transaction = db.transaction('presentation', mode);
        const store = transaction.objectStore('presentation');
        const operation = mode === 'readwrite' ? store.put(data, 'current') : store.get('current');
        // Only a committed transaction is a successful browser backup.
        transaction.oncomplete = () => { db.close(); finish(null, operation.result); };
        transaction.onerror = transaction.onabort = () => { db.close(); finish(transaction.error || new Error('Browser backup failed.')); };
      } catch (error) { db.close(); finish(error); }
    };
  });
}

function signalSave() {
  try { localStorage.setItem(SIGNAL_KEY, `${Date.now()}-${Math.random()}`); } catch { /* Disk still saved. */ }
  window.dispatchEvent(new Event(SAVE_EVENT));
}

export function usePresentationData() {
  const editor = window.location.pathname === '/edit';
  const [data, commitData] = useState(() => cloneData(presentationData));
  const [ready, setReady] = useState(false);
  const [storage, setStorage] = useState({ mode: 'loading', message: 'Opening presentation…' });
  const [historyVersion, setHistoryVersion] = useState(0);
  const current = useRef(data);
  const undoStack = useRef([]);
  const redoStack = useRef([]);
  const lastEdit = useRef(0);
  const localAvailable = useRef(false);
  const writeQueue = useRef(Promise.resolve());
  const fileHandle = useRef(null);
  const backedUp = useRef(null);
  const diskSaved = useRef(null);
  const diskSavedAt = useRef(0);
  const readyRef = useRef(false);

  const setData = useCallback((updater) => {
    const before = current.current;
    const next = typeof updater === 'function' ? updater(before) : updater;
    if (next === before) return;
    if (Date.now() - lastEdit.current > 600 || !undoStack.current.length) {
      undoStack.current = [...undoStack.current.slice(-39), before];
    }
    lastEdit.current = Date.now();
    redoStack.current = [];
    current.current = next;
    commitData(next);
    setHistoryVersion((value) => value + 1);
  }, []);

  useEffect(() => {
    let active = true;
    let loading = false;
    let loadVersion = 0;
    const load = async () => {
      if (editor && (readyRef.current || loading)) return;
      const version = ++loadVersion;
      loading = true;
      let disk = null;
      let diskError;
      try {
        try { disk = await localRequest(); } catch (error) { diskError = error; }
        let backup;
        try { backup = await indexedData('readonly'); } catch { /* Try legacy data. */ }
        const record = backup?.format === 'ahm-backup-v1' ? backup : { data: backup };
        let browserData;
        try { if (record.data) browserData = validatePresentation(record.data); } catch { /* Keep a valid disk or legacy copy. */ }
        if (!browserData) {
          try {
            const legacy = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (legacy) browserData = validatePresentation(legacy);
          } catch { /* Ignore malformed legacy data. */ }
        }
        if (!active || version !== loadVersion) return;
        const recoverPending = browserData && record.pendingDisk && (!disk?.data || (disk.savedAt || 0) <= (record.baseSavedAt || 0));
        const saved = recoverPending ? browserData : disk?.data || browserData;
        const next = saved ? validatePresentation(saved) : cloneData(presentationData);
        localAvailable.current = !!disk;
        diskSavedAt.current = disk?.savedAt || 0;
        current.current = next;
        commitData(next);
        backedUp.current = next;
        diskSaved.current = disk?.data && !recoverPending ? next : null;
        const message = recoverPending ? 'Recovered changes from browser backup · saving to disk…' : disk ? (disk.data ? 'Saved on disk · .local/presentation.json' : 'Preparing local autosave…') : 'Browser backup · use Save to Local File for a disk copy';
        setStorage({ mode: diskError ? 'error' : disk ? 'local' : 'browser', message: diskError ? `Local save unavailable. ${browserData ? 'Browser backup recovered.' : 'Using the default deck.'} Use Save to Local File for a disk copy.` : message });
      } catch (error) {
        if (active && version === loadVersion) setStorage({ mode: 'error', message: `Could not open saved data: ${error.message}` });
      } finally {
        if (active && version === loadVersion) { loading = false; readyRef.current = true; setReady(true); }
      }
    };
    load();
    const onStorage = (event) => { if (event.key === SIGNAL_KEY || event.key === STORAGE_KEY) load(); };
    const onVisible = () => { if (document.visibilityState === 'visible') load(); };
    window.addEventListener('storage', onStorage);
    window.addEventListener(SAVE_EVENT, load);
    window.addEventListener('focus', load);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      active = false;
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(SAVE_EVENT, load);
      window.removeEventListener('focus', load);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [editor]);

  const persist = useCallback((snapshot, includeDisk = true) => {
    const operation = writeQueue.current.catch(() => {}).then(async () => {
      let browserError;
      const pendingDisk = includeDisk && localAvailable.current;
      try { await indexedData('readwrite', { format: 'ahm-backup-v1', data: snapshot, pendingDisk, baseSavedAt: diskSavedAt.current }); backedUp.current = snapshot; }
      catch (error) { browserError = error; }
      if (includeDisk && localAvailable.current) {
        const saved = await localRequest('PUT', snapshot);
        if (!saved) throw new Error('The local save server is unavailable. Use Export JSON for a disk copy.');
        diskSaved.current = snapshot;
        diskSavedAt.current = saved.savedAt || 0;
        try { await indexedData('readwrite', { format: 'ahm-backup-v1', data: snapshot, pendingDisk: false, baseSavedAt: diskSavedAt.current }); backedUp.current = snapshot; } catch { /* Disk copy succeeded. */ }
        signalSave();
        return 'Saved on disk · .local/presentation.json';
      }
      if (browserError) throw browserError;
      signalSave();
      return 'Browser backup updated · save a local file to keep a disk copy';
    });
    writeQueue.current = operation;
    return operation;
  }, []);

  useEffect(() => {
    if (!editor || !ready || (localAvailable.current ? data === diskSaved.current : data === backedUp.current)) return;
    setStorage({ mode: 'saving', message: 'Saving…' });
    const timer = setTimeout(() => {
      persist(data).then((message) => {
        if (data === current.current) setStorage({ mode: localAvailable.current ? 'local' : 'browser', message });
      }).catch((error) => { if (data === current.current) setStorage({ mode: 'error', message: error.message || 'Autosave failed. Export JSON to keep your changes.' }); });
    }, 800);
    return () => clearTimeout(timer);
  }, [data, editor, ready, persist]);

  useEffect(() => {
    if (!editor) return;
    const onLeave = (event) => {
      if (localAvailable.current ? current.current !== diskSaved.current : current.current !== backedUp.current) {
        event.preventDefault(); event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', onLeave);
    return () => window.removeEventListener('beforeunload', onLeave);
  }, [editor]);

  const actions = useMemo(() => ({
    setData, ready, storage,
    canUndo: undoStack.current.length > 0,
    canRedo: redoStack.current.length > 0,
    undo: () => {
      const previous = undoStack.current.pop();
      if (!previous) return;
      redoStack.current.push(current.current);
      current.current = previous; commitData(previous); lastEdit.current = 0;
      setHistoryVersion((value) => value + 1);
    },
    redo: () => {
      const next = redoStack.current.pop();
      if (!next) return;
      undoStack.current.push(current.current);
      current.current = next; commitData(next); lastEdit.current = 0;
      setHistoryVersion((value) => value + 1);
    },
    save: async () => {
      try {
        // Open the picker while the user gesture is still active.
        if (!localAvailable.current && window.showSaveFilePicker && !fileHandle.current) {
          fileHandle.current = await window.showSaveFilePicker({ suggestedName: `${safeFilename(current.current.eventTitle)}.json`, types: [{ description: 'Presentation', accept: { 'application/json': ['.json'] } }] });
        }
        const snapshot = current.current;
        let message;
        if (localAvailable.current) message = await persist(snapshot);
        else {
          const json = JSON.stringify(snapshot, null, 2);
          if (fileHandle.current) {
            const writable = await fileHandle.current.createWritable();
            await writable.write(json); await writable.close();
            message = `Saved to local file · ${fileHandle.current.name}`;
          } else {
            downloadFile(new Blob([json], { type: 'application/json' }), `${safeFilename(snapshot.eventTitle)}.json`);
            message = 'Local JSON download started. Keep it to reopen your presentation.';
          }
          diskSaved.current = snapshot;
          try { await persist(current.current, false); } catch { /* The disk copy succeeded. */ }
        }
        if (snapshot === current.current) setStorage({ mode: 'local', message });
        else setStorage({ mode: localAvailable.current ? 'saving' : 'browser', message: localAvailable.current ? 'Saved earlier edits · saving newer changes…' : 'File saved · newer edits are in browser backup; save again to update the local file' });
        return { ok: true, message };
      } catch (error) {
        if (error.name === 'AbortError') return { ok: false, cancelled: true };
        setStorage({ mode: 'error', message: error.message });
        return { ok: false, message: error.message };
      }
    },
    reset: () => setData(cloneData(presentationData)),
    exportJson: () => downloadFile(new Blob([JSON.stringify(current.current, null, 2)], { type: 'application/json' }), `${safeFilename(current.current.eventTitle)}.json`),
    exportZip: () => exportPortable(current.current),
    importJson: async (file) => {
      if (file.size > 100 * 1024 * 1024) throw new Error('Choose a JSON file smaller than 100 MB.');
      const next = validatePresentation(JSON.parse(await file.text()));
      setData(next);
      lastEdit.current = 0;
    }
  }), [setData, ready, storage, historyVersion, persist]);
  return [data, actions];
}
