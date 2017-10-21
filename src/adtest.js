
var ads = [];

ads.push(0);
ads.push(1);
ads.push(2);
ads.push(3);
ads.push(4);
ads.push(5);

console.log(ads);
for (var i = ads.length-1; i >= 0; i--) {
    var e = ads.splice(Math.floor(Math.random() * ads.length), 1);
    console.log(e);
    console.log(ads);
}

