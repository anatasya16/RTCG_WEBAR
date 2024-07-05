var fileInput = document.getElementById("finput");
var imgCanvas1 = document.getElementById("panel1");
var imgCanvas2 = document.getElementById("panel2");
var imgCanvas3 = document.getElementById("panel3");
var context1 = imgCanvas1.getContext('2d');
var context2 = imgCanvas2.getContext('2d');
var context3 = imgCanvas3.getContext('2d');
var grayImage;
var featuredImage;

function uploadImage() {
  var file = fileInput.files[0];
  var reader = new FileReader();
  reader.onload = function(event) {
    var img = new Image();
    img.onload = function() {
      featuredImage = img; // Assign the loaded image to featuredImage
      // Set the dimensions of panel1 and panel3 to match the image
  imgCanvas1.width = img.width;
  imgCanvas1.height = img.height;
  imgCanvas2.width = img.width;
  imgCanvas2.height = img.height;
  imgCanvas3.width = img.width;
  imgCanvas3.height = img.height;
  
      context1.drawImage(featuredImage, 0, 0, featuredImage.width, featuredImage.height); // Draw the image onto panel1
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

function convertGrayscale() {
  if (featuredImage) {
    grayImage = new SimpleImage(featuredImage);
    // Convert image to grayscale
    for (var pixel of grayImage.values()) {
      var avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue()) / 3;
      pixel.setRed(avg);
      pixel.setGreen(avg);
      pixel.setBlue(avg);
    }
    // Draw grayscale image on panel2
    grayImage.drawTo(imgCanvas2);
  } else {
    console.log("Please select an image first.");
  }
}

function featureDetection() {
  if (featuredImage) {
    var width = featuredImage.width;
    var height = featuredImage.height;
    var context = imgCanvas3.getContext('2d');
    context.clearRect(0, 0, width, height); // Clear the canvas

    // Draw featuredImage onto panel3
    context.drawImage(featuredImage, 0, 0, width, height);

    // Perform feature detection
    tracking.Fast.THRESHOLD = 10;
    var imageData = context.getImageData(0, 0, width, height);
    var gray = tracking.Image.grayscale(imageData.data, width, height);
    var corners = tracking.Fast.findCorners(gray, width, height);
    

    // Draw detected corners
    for (var i = 0; i < corners.length; i += 2) {
      context.fillStyle = '#f00';
      context.fillRect(corners[i], corners[i + 1], 3, 3);
    }
  } else {
    console.log("Please select an image first.");
  }
}

function download() {
  const image = panel3.toDataURL();
  const link = document.createElement("a");
  link.href = image;
  link.download = "Feature Extraction.png";
  link.click();
  //document.querySelector("button").addEventListener("click", download)
}
