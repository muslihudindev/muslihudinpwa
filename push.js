var webPush = require('web-push');

const vapidKeys = {
    "publicKey": "BAzg3Rz6ghhqH3KWVz1kW6S6TTVgLYHidMNMFfr59rkfMgBnMtypVZITQ-4HQaC81j-JcSoPwUh-K1DIAsecV7s",
    "privateKey": "TPH4cwsFV3DPjsPZMFakKSRGnZd6dkJHgvD9OvDdKy8"
};


webPush.setVapidDetails(
    'mailto:hikariroger@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
var pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/cEeGp04IfPA:APA91bHjpVyyW4CvISMZC7Y3RBDkhLZvlz_s1vG_Dpx6PbYkd-g7HJJiQ3OT7yxjPS0bqp906exWOIyIO-P6mOSIi3vDOtxRrHCHcgR0EJe4w4-5uA1fDVyN86WWekb7Veshq9gG3AIt",
    "keys": {
        "p256dh": "BPNf8QUKvHnSLhwI3CaY8OXYV+ggPnI6yM5U8pd8ZI/gIdOyBoTHySXGbqK5q17Ohw9ECnahzImIkGY5DC0tMEw=",
        "auth": "qlxVcJOyMmOgu9FijmEkeA=="
    }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';

var options = {
    gcmAPIKey: '20932222653',
    TTL: 60
};

webPush.sendNotification(
    pushSubscription,
    payload,
    options
);