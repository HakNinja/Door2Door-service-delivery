//hero-bg images generator
function randImage(){
    var files = [            
        "../assets/hero/hero-bg-0.jpg",
        "../assets/hero/hero-bg-1.jpg",
        "../assets/hero/hero-bg-2.jpg",
        "../assets/hero/hero-bg-3.jpg",
        "../assets/hero/hero-bg-4.jpg",
        "../assets/hero/hero-bg-5.jpg",
        "../assets/hero/hero-bg-6.jpg",
        "../assets/hero/hero-bg-7.jpg",
        "../assets/hero/hero-bg-8.jpg",
        "../assets/hero/hero-bg-9.jpg",
        "../assets/hero/hero-bg-10.jpg",
        "../assets/hero/hero-bg-11.jpg",
        "../assets/hero/hero-bg-12.jpg",
        "../assets/hero/hero-bg-13.jpg",
        "../assets/hero/hero-bg-15.jpg",
        "../assets/hero/hero-bg-16.jpg",
        "../assets/hero/hero-bg-17.jpg",
        "../assets/hero/hero-bg-18.jpg",
        "../assets/hero/hero-bg-19.jpg",
        "../assets/hero/hero-bg-20.jpg"];
        var randIndex = Math.floor(Math.random() * files.length);
        document.getElementById("hero").style.backgroundImage = "url('" + files[randIndex] + "')";
    }
randImage();
setInterval(randImage, 15000);