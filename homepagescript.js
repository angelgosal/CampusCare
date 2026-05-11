document.addEventListener('DOMContentLoaded',()=>{

    const backBtn=document.getElementById('backBtn');
    const logoLink=document.getElementById('logoLink');

    if(backBtn){
        backBtn.addEventListener('click',()=>{
            window.location.href='homepage.html';
        });
    }

    if(logoLink){
        logoLink.addEventListener('click',()=>{
            window.location.href='aboutus.html';
        });
    }

    loadReportsToHomepage();

});

function toggleSort(){

    const menu=document.getElementById('sortMenu');

    if(menu){
        menu.style.display=
        menu.style.display==='block'
        ?'none'
        :'block';
    }

}

function globalSearch(){

    const q=document.getElementById('searchInput').value.toLowerCase();

    const sections=document.querySelectorAll(
        '.fixed-facility-section,.progress-section'
    );

    sections.forEach(section=>{

        const cards=section.querySelectorAll(
            '.searchable-card,.fixed-card-content'
        );

        let sectionHasMatch=false;

        cards.forEach(card=>{

            const text=card.innerText.toLowerCase();

            if(text.includes(q)){
                card.style.display="";
                sectionHasMatch=true;
            }
            else{
                card.style.display="none";
            }

        });

        const title=section.querySelector('.section-title')
        .innerText.toLowerCase();

        if(title.includes(q)){

            sectionHasMatch=true;

            cards.forEach(card=>{
                card.style.display="";
            });

        }

        section.style.display=
        sectionHasMatch
        ?"block"
        :"none";

    });

}

function globalSort(crit){

    const sections=[
        {container:document.getElementById("fixedContainer")},
        {container:document.getElementById("issuedContainer")}
    ];
    sections.forEach(obj=>{

        const cont=obj.container;

        if(!cont)return;

        const cards=Array.from(
            cont.querySelectorAll(
                ".report-card,.fixed-card-content"
            )
        );

        const oldEmpty=cont.querySelector(".empty-message");

        if(oldEmpty)oldEmpty.remove();

        cards.forEach(card=>{
            card.style.display="";
        });

        if(crit==="Recent"||crit==="Latest"){

            cards.sort((a,b)=>{

                const dateA=new Date(
                    a.dataset.date||"2000-01-01"
                );

                const dateB=new Date(
                    b.dataset.date||"2000-01-01"
                );

                return crit==="Recent"
                ?dateB-dateA
                :dateA-dateB;

            });

            cards.forEach(card=>{
                cont.appendChild(card);
            });

        }

        else{

            const target=crit.toLowerCase();

            let visibleCount=0;

            cards.forEach(card=>{

                const floor=
                (card.dataset.floor||"")
                .toLowerCase();

                if(floor.includes(target)){

                    card.style.display="";
                    visibleCount++;

                }

                else{

                    card.style.display="none";

                }

            });

            if(visibleCount===0){

                const empty=document.createElement("div");

                empty.className="empty-message";
                empty.innerText="None";

                cont.appendChild(empty);

            }

        }

    });

    const menu=document.getElementById("sortMenu");

    if(menu){
        menu.style.display='none';
    }

}

function scrollSection(id,direction){

    const container=document.getElementById(id);

    if(!container)return;

    const cards=Array.from(container.children)
    .filter(card=>
        card.style.display!=="none" &&
        !card.classList.contains("empty-message")
    );

    if(cards.length===0)return;

    const currentScroll=container.scrollLeft;

    let currentIndex=0;

    cards.forEach((card,index)=>{

        if(Math.abs(card.offsetLeft-currentScroll)<80){
            currentIndex=index;
        }

    });

    let nextIndex=currentIndex+direction;

    if(nextIndex>=cards.length)nextIndex=0;
    if(nextIndex<0)nextIndex=cards.length-1;

    container.scrollTo({
        left:cards[nextIndex].offsetLeft,
        behavior:"smooth"
    });

}

window.onclick=(e)=>{

    const menu=document.getElementById('sortMenu');

    if(
        menu &&
        !e.target.closest('.sort-wrapper') &&
        !e.target.closest('.btn-action')
    ){
        menu.style.display='none';
    }

};

function loadReportsToHomepage(){

    const issuedContainer=
    document.getElementById("issuedContainer");

    const fixedContainer=
    document.getElementById("fixedContainer");

    if(!issuedContainer||!fixedContainer)return;

    const reports=
    JSON.parse(localStorage.getItem("reports"))||[];

    issuedContainer.innerHTML="";
    fixedContainer.innerHTML="";

    // FIXED
    const fixedReports=reports.filter(
        report=>report.status==="Fixed"
    );

    if(fixedReports.length===0){

        fixedContainer.innerHTML=`
            <div class="empty-message">
                None
            </div>
        `;

    }

    else{

        fixedReports.forEach(report=>{

            const fixedCard=document.createElement("div");

            fixedCard.classList.add(
                "fixed-card-content"
            );

            fixedCard.dataset.date=report.date;

            fixedCard.dataset.floor=
            report.area
            ?report.area.split(" - ")[0]
            :"";

            fixedCard.innerHTML=`

                <div class="image-overlay-wrapper">

                    ${
                        report.image
                        ?`<img src="${report.image}" class="fixed-photo">`
                        :`<div class="no-image">No image</div>`
                    }

                    <div class="status-overlay">

                        <span class="status-pill">
                            ${report.area}
                        </span>

                        <span class="status-pill">
                            ${report.facility}
                        </span>

                        <span class="status-pill">
                            Fixed
                        </span>

                    </div>

                </div>

            `;

            fixedContainer.appendChild(fixedCard);

        });

    }

    // ACTIVE
    const activeReports=reports.filter(
        report=>report.status!=="Fixed"
    );

    if(activeReports.length===0){

        issuedContainer.innerHTML=`
            <div class="empty-message">
                None
            </div>
        `;

    }

    else{

        activeReports.forEach(report=>{

            const card=document.createElement("div");

            card.classList.add(
                "report-card",
                "searchable-card"
            );

            card.dataset.date=report.date;

            card.dataset.floor=
            report.area
            ?report.area.split(" - ")[0]
            :"";

            card.innerHTML=`

                <div class="date-box">
                    ${report.date||"-"}
                </div>

                <div class="img-box">

                    ${
                        report.image
                        ?`<img src="${report.image}">`
                        :`<div class="no-image">No image</div>`
                    }

                    <span class="report-status">
                        ${report.status}
                    </span>

                </div>

                <div class="info-box">
                    (${report.area||"-"}),
                    (${report.facility||"-"})
                </div>

            `;

            issuedContainer.appendChild(card);

        });

    }

}
