const $=id=>document.getElementById(id);
let box=-1,qIndex=-1,answered=false,voice=null;
const sound={ambient:$("ambient"),click:$("clickS"),shake:$("shakeS"),open:$("openS"),reveal:$("revealS"),correct:$("correctS"),wrong:$("wrongS")};

function play(a,v=.75){try{a.currentTime=0;a.volume=v;a.play().catch(()=>{})}catch(e){}}
function loadVoice(){const v=speechSynthesis.getVoices()||[];voice=v.find(x=>/^ar/i.test(x.lang))||v[0]||null}
function speak(t){if(!("speechSynthesis" in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang=voice?.lang||"ar-SA";u.voice=voice;u.rate=.82;speechSynthesis.speak(u)}
function positionPicker(btn){const s=$("stage").getBoundingClientRect(),r=btn.getBoundingClientRect();$("picker").style.left=((r.left-s.left+r.width/2)/s.width*100)+"%";$("picker").style.top=((r.top-s.top+5)/s.height*100)+"%"}
function renderPicker(){const c=$("pickerButtons");c.innerHTML="";for(let i=0;i<5;i++){const b=document.createElement("button");b.textContent=i+1;b.onclick=()=>openQuestion(i);c.appendChild(b)}}
function choose(btn,i){
 box=i;speak(BOXES[i].name);$("picker").classList.add("hidden");play(sound.click,.5);btn.classList.add("shake");play(sound.shake,.75);
 setTimeout(()=>{btn.classList.remove("shake");btn.classList.add("open");play(sound.open,.85);const s=$("stage").getBoundingClientRect(),r=btn.getBoundingClientRect();$("spark").style.left=((r.left-s.left+r.width/2)/s.width*100)+"%";$("spark").style.top=((r.top-s.top+20)/s.height*100)+"%";$("spark").classList.remove("show");void $("spark").offsetWidth;$("spark").classList.add("show")},1200);
 setTimeout(()=>{btn.classList.remove("open");positionPicker(btn);renderPicker();$("picker").classList.remove("hidden");speak("اختر رقم السؤال")},2200)
}
function openQuestion(i){
 qIndex=i;answered=false;const q=BOXES[box].questions[i];
 $("picker").classList.add("hidden");$("question").textContent=q.q;$("feedback").textContent="";$("next").classList.add("hidden");
 const a=$("answers");a.innerHTML="";
 q.options.forEach((o,n)=>{const b=document.createElement("button");b.className="answer";b.innerHTML=`<img src="assets/images/${o[1]}" alt="${o[0]}"><span>${o[0]}</span>`;b.onclick=()=>answer(b,n);a.appendChild(b)});
 $("modal").classList.remove("hidden");play(sound.reveal,.6);setTimeout(()=>speak(q.q),350)
}
function answer(btn,n){
 if(answered)return;answered=true;const q=BOXES[box].questions[qIndex],cards=[...document.querySelectorAll(".answer")];
 if(n===q.answer){btn.classList.add("correct");$("feedback").textContent="🎉 أحسًنت  !";play(sound.correct,.85);speak("أحسًنت");confetti()}
 else {
     btn.classList.add("wrong"); cards[q.answer].classList.add("correct"); $("feedback").textContent = "🙂 لا بأس حاول مرة اخرى"; play(sound.wrong, .65); speak(`لا بأس حاول مرة اخرى .
 ${q.explanation}`)
 }
 cards.forEach(x=>x.disabled=true);$("next").classList.remove("hidden")
}
function confetti(){const w=$("confetti");w.innerHTML="";for(let i=0;i<35;i++){const s=document.createElement("span");s.className="piece";s.textContent=["⭐","✨","🎉","🌟"][Math.floor(Math.random()*4)];s.style.left=Math.random()*100+"%";s.style.fontSize=(18+Math.random()*25)+"px";s.style.animationDelay=Math.random()*.3+"s";w.appendChild(s)}setTimeout(()=>w.innerHTML="",1900)}
function closeQ(){speechSynthesis.cancel();$("modal").classList.add("hidden")}
document.querySelectorAll(".chest").forEach(c=>c.onclick=()=>choose(c,+c.dataset.box));
$("xClose").onclick=closeQ;$("next").onclick=closeQ;$("repeat").onclick=()=>speak(BOXES[box].questions[qIndex].q);
document.querySelector(".backdrop").onclick=closeQ;
document.addEventListener("click",()=>{sound.ambient.volume=.055;sound.ambient.play().catch(()=>{})},{once:true});
loadVoice();if("speechSynthesis" in window)speechSynthesis.onvoiceschanged=loadVoice;
