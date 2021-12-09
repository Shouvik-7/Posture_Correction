let capture;
let posenet;
let singlePose;
let skeleton;
let scale = 1;
let headDrop;
let slumping;
let leanForward;
let colorR=255;
let colorG=255;
function setup() {
    createCanvas(800,500);
    capture = createCapture(VIDEO)
    capture.hide();
    posenet = ml5.poseNet(capture,modelLoaded);
    posenet.on('pose',receivedPoses); 
}
function receivedPoses(poses){
    //console.log(poses);
    if(poses.length > 0){
        singlePose = poses[0].pose;
        skeleton = poses[0].skeleton;
    }
}

function modelLoaded(){
    console.log('Model has loaded');
}
function lean_forward(){
    if(singlePose.leftShoulder.x>=(singlePose.leftEar.x +(scale*120)) || singlePose.rightEar.x>=(singlePose.rightShoulder.x +(scale*120))){
        return true;
    }
    return false;
}

function slump(){
    //neckX = (singlePose.leftShoulder.x + singlePose.rightShoulder.x)/2;
    neckY = (singlePose.leftShoulder.y + singlePose.rightShoulder.y)/2;
    if(neckY - singlePose.nose.y <= scale * 140){
        return true;
    }
    return false;
}

function head_drop(){
    if(singlePose.leftEye.y > (singlePose.leftEar.y + (scale*10) ))
    {
        return true;
    }
    if(singlePose.rightEye.y > (singlePose.rightEar.y + (scale*10) ))
    {
        return true;
    }
    return false;
}

function draw() {
    
    stroke(colorR,colorG,0);
    strokeWeight(10);
    rect(0,0,650,490)
    image(capture,6,6,640,480);
    fill(255,255,255);
    if(singlePose){

        // drawing points
        for(let i=0; i<singlePose.keypoints.length; i++){
            strokeWeight(5);
            ellipse(singlePose.keypoints[i].position.x,singlePose.keypoints[i].position.y,10);
        }
        stroke(255,255,255);
        for(let j=0;j<skeleton.length;j++)
        {
            line(skeleton[j][0].position.x,skeleton[j][0].position.y,skeleton[j][1].position.x,skeleton[j][1].position.y);
        }

        // checking for posture
        //stroke(55,250,50);
        //line(singlePose.leftShoulder.x,singlePose.leftEar.y,singlePose.leftEar.x,singlePose.leftEar.y)
        //line(singlePose.rightShoulder.x,singlePose.rightEar.y,singlePose.rightEar.x,singlePose.rightEar.y)
        
        if(lean_forward())
        {
            leanForward+=1;
            //console.log(leanForward);
            if(leanForward>=500)
            {
                alert('Sit Back! You are leaning forward.')
            }
            colorG=0;
            colorR=255;
            //console.log('lean back  :'+ singlePose.leftShoulder.x + " ,"+ singlePose.leftEar.x);
        }
        
        else{
            leanForward = 0;
            //console.log('not leaning forward :'+ singlePose.leftShoulder.x + " ,"+ singlePose.leftEar.x);
        }
        
        if(slump())
        {
            slumping += 1;
            //console.log(slumping);
            if(slumping>=500)
            {
                
                alert('Sit up! You are slumping down.')    
            }
            colorG=0;
            colorR=255;
            
        }
        else{
            
            //console.log('situp  :'+ res)
            slumping = 0;
            //console.log('no slumping :'+ singlePose.leftShoulder.x + " ,"+ singlePose.leftEar.x);
        }
        
        
        if(head_drop())
        {
            headDrop+=1;
            //console.log(headDrop);
            if(headDrop>=500){
                alert('Lift your head!');
                
            }
            colorG=0;
            colorR=255;
            
        }
        else{
            headDrop = 0;
            //console.log('good posture :'+ singlePose.leftShoulder.x + " ,"+ singlePose.leftEar.x);
        }

        if(!(head_drop() + lean_forward() + slump()))
        {
            colorG=255;
            colorR=0;
        }
        
    }
}
