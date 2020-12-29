var rawImgs = new Array()
var enaImgsTypes = new Array()
var models = new Array()
var test
var assets
var rawBtnClickedText
var enaBtnClickedText
var font
var modelImg
var modelName
var rawBtns = []
var enaBtns = []
var modBtns = []

function preload() {
  assets = loadJSON('assets/assets.json', () => {
    rawBtnClickedText = assets.RawImgs[0].split(".")[0]
    // 加载底料图片
    for (var rawImg of assets.RawImgs) {
      var rawImgName = rawImg.split(".")[0]
      rawImgs.push(loadImage('assets/raw/' + rawImg))
      var enaImgNames = assets[rawImgName]
      let enaImgs = new Array()
      for (var item in enaImgNames) {
        enaImgs.push(loadImage('assets/' + rawImgName + '/' + enaImgNames[item]))
        //调试时查看加载的文件名
        // enaImgs.push('assets/' + rawImgName + '/' + enaImgNames[item])
      }
      enaImgsTypes[rawImgName] = enaImgs
    }
    //加载模型
    for (var modelItem of assets.Models) {
      models.push({ "name": modelItem.name, "img": loadImage('assets/model/' + modelItem.img), "obj": modelItem.obj })
    }

  });
  //加载字体，webgl canvas 要求先加载字体
  font = loadFont(
    'https://fonts.gstatic.com/ea/notosanstc/v1/NotoSansTC-Regular.otf'
  );
}

function make_raw_panel() {
  modelImg = rawImgs[0]
  var rawButNum = 0
  //2d canvas 坐标，屏幕左上角[0,0]
  // var pY = 65;
  //3d canvas 坐标, 屏幕正中[0,0]
  var pY = -height / 2 + 65;
  for (var i = 0; i < 8; i++) {
    //2d canvas 坐标，屏幕左上角[0,0]
    // var pX = 5;
    //3d canvas 坐标, 屏幕正中[0,0]
    var pX = -width / 2 + 5;
    for (var j = 0; j < 4; j++) {
      if (rawButNum < rawImgs.length) {
        rawBtns.push(new Clickable())
        rawBtns[rawButNum].locate(pX, pY)

        rawBtns[rawButNum].resize(60, 60)
        rawBtns[rawButNum].stroke = "#FFFFFF"
        rawBtns[rawButNum].text = assets.RawImgs[rawButNum].split(".")[0]
        rawBtns[rawButNum].img = rawImgs[rawButNum]
        rawBtns[rawButNum].onPress = function () {
          rawBtnClickedText = this.text
          //用点击按纽的img 渲染3d model
          modelImg = this.img
          // 绘制选中的raw对应的enamel panel
          make_ena_panel(this.text)
          for (rawBtn of rawBtns) {
            rawBtn.stroke = "#FFFFFF"
          }
          this.stroke = "#FF0000"
        }
        pX += 60 + 20;
        rawButNum++
      }
    }
    pY += 60 + 38
  }
  rawBtns[0].stroke = "#FF0000"
  make_ena_panel(rawBtns[0].text)
}
function make_ena_panel(raw_name) {
  //enamel panel
  enaBtns = []
  var enaImgsCount = 0
  var enaButNum = 0
  //2d canvas 坐标，屏幕左上角[0,0]
  // var pY = 65;
  //3d canvas 坐标, 屏幕正中[0,0]
  var pY = -height / 2 + 65;
  var enaImgs = enaImgsTypes[rawBtnClickedText]
  var enaRow = Math.ceil(enaImgsTypes[raw_name].length / 4)
  for (var count = 0; count < enaImgsTypes[raw_name].length; count++) {
    for (var i = 0; i < enaRow; i++) {
      //2d canvas 坐标，屏幕左上角[0,0]
      // var pX = 1095;
      //3d canvas 坐标, 屏幕正中[0,0]
      var pX = 1095 - width / 2;
      //每行四列
      for (var j = 0; j < 4; j++) {
        if (enaButNum < enaImgsTypes[raw_name].length) {
          enaBtns.push(new Clickable())
          enaBtns[enaButNum].locate(pX, pY)
          enaBtns[enaButNum].resize(60, 60)
          enaBtns[enaButNum].stroke = "#FFFFFF"

          //初始化默认分配第一个raw CN042的ena文件名
          enaBtns[enaButNum].text = assets[rawBtnClickedText][enaButNum].split(".")[0]
          enaBtns[enaButNum].img = enaImgsTypes[raw_name][enaButNum]
          enaBtns[enaButNum].onPress = function () {
            //用点击按纽的img 渲染3d model
            modelImg = this.img
            for (enaBtn of enaBtns) {
              enaBtn.stroke = "#FFFFFF"
            }
            this.stroke = "#FF0000"
          }
          pX += 60 + 20;

          enaButNum++
        }
      }
      pY += 60 + 38
    }
  }
}
function make_model_panel() {
  modelImg = rawImgs[0]
  modelName = 'box'
  var modelButNum = 0
  //3d canvas 坐标, 屏幕正中[0,0]
  // rect(- width / 2 + 320, 710 - height / 2, 760, 110)

  //2d canvas 坐标，屏幕左上角[0,0]
  // var pY = 65;
  // var pX = 5;
  //3d canvas 坐标, 屏幕正中[0,0]
  // var pY = 710 - height / 2 + 40;
  var pY = 315
  var pX = -width / 2 + 400;
  for (var i = 0; i < models.length; i++) {
    modBtns.push(new Clickable())
    modBtns[i].locate(pX, pY)
    modBtns[i].resize(80, 80)
    modBtns[i].stroke = "#FFFFFF"
    modBtns[i].text = models[i].name
    modBtns[i].img = models[i].img
    modBtns[i].onPress = function () {
      //选择3d model
      modelName = this.text
      // 绘制选中的raw对应的enamel panel
      for (modBtn of modBtns) {
        modBtn.stroke = "#FFFFFF"
      }
      this.stroke = "#FF0000"
    }
    pX += 80 + 30;
  }
  modBtns[0].stroke = "#FF0000"
}
function setup() {
  createCanvas(1400, 820, WEBGL)
  textFont(font)
  smooth()
  //raw panel
  //2d canvas 坐标，屏幕左上角[0,0]
  //rect(0, 0, 310, height)
  //3d canvas 坐标, 屏幕正中[0,0]
  // rect(-width / 2, -height / 2, 310, height)
  // rect(- width / 2 + 320, 710 - height / 2, 760, 110)
  make_raw_panel()
  make_model_panel()

}

function draw() {
  //重绘enamel panel上次留下的button框,只在这里效果成常，放在make_ena_panel或make_raw_panel中的button press事件中不正常
  // colorMode(RGB)
  // strokeWeight(0.2)
  // stroke(127)
  //重绘背景，消除3d model旋转带来的痕迹
  background(127)
  fill(80)
  //2d canvas 坐标，屏幕左上角[0,0]
  //rect(0, 0, 310, height)
  //rect(1090, 0, 310, height)
  //rect(320, 710, 760, 110)

  //3d canvas 坐标, 屏幕正中[0,0]

  rect(-width / 2, -height / 2, 310, height)
  rect(1090 - width / 2, -height / 2, 310, height)
  rect(- width / 2 + 320, 710 - height / 2, 760, 110)
  texture(modelImg);
  switch (modelName) {
    case "box": {
      //渲染3D模型box
      push();
      rotateZ(frameCount * 0.005)
      rotateX(frameCount * 0.005)
      rotateY(frameCount * 0.005)
      box(200)
      pop()
      break
    }
    case "cylinder": {
      push();
      rotateZ(frameCount * 0.005)
      rotateX(frameCount * 0.005)
      rotateY(frameCount * 0.005)
      cylinder(100, 200)
      pop()
      break
    }
    case "sphere": {
      push();
      rotateZ(frameCount * 0.005)
      rotateX(frameCount * 0.005)
      rotateY(frameCount * 0.005)
      sphere(150)
      // torus(80, 30)
      pop()
      break
    }
    case "cone": {
      push();
      rotateZ(frameCount * 0.005)
      rotateX(frameCount * 0.005)
      rotateY(frameCount * 0.01)
      cone(150, 200)
      pop()
      break
    }
    case "torus": {
      push();
      rotateZ(frameCount * 0.005)
      rotateX(frameCount * 0.005)
      rotateY(frameCount * 0.005)
      torus(100, 20)
      pop()
      break
    }
    case "ellipsoid": {
      push();
      rotateZ(frameCount * 0.005)
      rotateX(frameCount * 0.005)
      rotateY(frameCount * 0.005)
      ellipsoid(60, 80, 80);
      pop()
      break
    }
  }

  stroke(0);
  fill(255);
  textSize(13);
  textAlign(LEFT);
  //2d Canvas
  // text("底料颜色", 125, 25);
  // text("成品颜色", 1220, 25);
  //3d Canvas
  text("底料素材", -width / 2 + 125, -height / 2 + 25);
  text("成品素材", 1220 - width / 2, -height / 2 + 25);
  textSize(12);
  // fill(0);
  for (var rawBtnIndex in rawBtns) {
    rawBtns[rawBtnIndex].draw()
    rect(rawBtns[rawBtnIndex].x, rawBtns[rawBtnIndex].y - 25, 50, 20)
    fill(255)
    text(rawBtns[rawBtnIndex].text, rawBtns[rawBtnIndex].x + 5, rawBtns[rawBtnIndex].y - 10)
    fill(0)
    image(rawBtns[rawBtnIndex].img, rawBtns[rawBtnIndex].x, rawBtns[rawBtnIndex].y, 60, 60)
  }
  for (var i = 0; i < enaBtns.length; i++) {
    enaBtns[i].text = assets[rawBtnClickedText][i].split(".")[0]
    enaBtns[i].draw()
    rect(enaBtns[i].x, enaBtns[i].y - 25, 63, 20)
    fill(255)
    var type = enaBtns[i].text.split('-')[0]
    var centigrade = enaBtns[i].text.split('-')[2] + '℃'
    var material
    if (enaBtns[i].text.split('-')[1] == 'cu') {
      material = '紫铜'
    } else if (enaBtns[i].text.split('-')[1] == 'si') {
      material = '银胎'
    }
    text(material + ' ' + centigrade, enaBtns[i].x + 2, rawBtns[i].y - 10)
    image(enaBtns[i].img, enaBtns[i].x, enaBtns[i].y, 60, 60)

  }

  for (var i = 0; i < modBtns.length; i++) {
    modBtns[i].draw()
    image(modBtns[i].img, modBtns[i].x, modBtns[i].y, 80, 80)
  }
}