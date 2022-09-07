const imageZone = document.getElementById('image_zone');
imageZone.addEventListener('change',resizePinnedImage,false);
function resizePinnedImage(e){
  const file = e.target.files[0];
  if(!file.type.match('image.*')) { return }
  resize(file)
}
function resize(file){
  imageToCanvas(file).then(function(canvas){
    Tesseract.recognize(
      canvas,
      'jpn + eng',
      { logger: m=> console.log(m) }
    ).then(({ data: { text } }) => {
      const out = document.getElementById('output');
      out.innerText = text;
    })
  }).catch(function (error){
    console.error(error)
  })
}
function imageToCanvas(imageFile){
  return new Promise(function (resolve, reject){
    readImage(imageFile).then(function(src){
      loadImage(src).then(function(image){
        const canvas = document.getElementById("canvas")
        const ctx = canvas.getContext('2d')
        const scale = 2
        canvas.width = image.width * scale
        canvas.height = image.height * scale
        ctx.drawImage(
          image,
          (image.width - (canvas.width / scale)) / scale, (image.height - (canvas.height / scale)) / scale,//最後の/scaleを/2としているのは常に2で割るから？計算式が分からないから何とも言えない
          canvas.width / scale, canvas.height / scale,
          0,0,
          canvas.width, canvas.height
        )
        resolve(canvas)
      }).catch(function(error){
        reject(error)
      })
    }).catch(function(error){
      reject(error)
    })
  })
}
function readImage(image){
  return new Promise(function(resolve,reject){
    const reader = new FileReader()
    reader.onload = function () { resolve(reader.result) }
    reader.onerror = function (e) { reject(e) }
    reader.readAsDataURL(image)
  })
}
function loadImage(src){
  return new Promise(function(resolve,reject){
    const img = new Image()
    img.onload = function () { resolve(img) }
    img.onerror = function (e) { reject(e) }
    img.src = src
  })
}
