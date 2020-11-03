var dbPromised = idb.open("epl-arena", 1, function (upgradeDb) {
    var datatimObjectStore = upgradeDb.createObjectStore("teams", {
        keyPath: "id"
    });
    datatimObjectStore.createIndex("name", "name", { unique: false });
});

function showNotifikasi(txt) {
    const title = 'Pemberitahuan';
    const options = {
        'body': txt,
    }
    if (Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(function(registration) {
            registration.showNotification(title, options);
        });
    } else {
        console.error('FItur notifikasi tidak diijinkan.');
    }
}

function saveForLater(datatim) {
    dbPromised
        .then(function (db) {
            var tx = db.transaction("teams", "readwrite");
            var store = tx.objectStore("teams");
            store.put(datatim);
            return tx.complete;
        })
        .then(function () {
            showNotifikasi("Tim berhasil ditambahkan menjadi Tim Favorit");
        });
}

function getAll() {
    return new Promise(function (resolve, reject) {
        dbPromised
            .then(function (db) {
                var tx = db.transaction("teams", "readonly");
                var store = tx.objectStore("teams");
                return store.getAll();
            })
            .then(function (datatim) {
                resolve(datatim);
            });
    });
}

function getById(id) {
    return new Promise(function (resolve, reject) {
        dbPromised
            .then(function (db) {
                var tx = db.transaction("teams", "readonly");
                var store = tx.objectStore("teams");
                return store.get(parseInt(id));
            })
            .then(function (datatim) {
                resolve(datatim);
            });
    });
}

function deleteById(id) {
    dbPromised
        .then(function (db) {
            var tx = db.transaction("teams", "readwrite");
            var store = tx.objectStore("teams");
            store.delete(parseInt(id));
            return tx.complete;
        })
        .then(function () {
            getSavedArticles();
            showNotifikasi("Tim berhasil dikeluarkan dari Tim Favorit");
        });
}
