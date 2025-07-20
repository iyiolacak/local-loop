import { addRxPlugin, createRxDatabase } from 'rxdb/plugins/core';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';

const DATABASE_NAME = "locally-loop-rxdb"

const db = await createRxDatabase(
    {
        name: DATABASE_NAME,
        storage: getRxStorageDexie(),
        
    }
)