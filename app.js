const crtBtn = document.getElementById("crtBtn")
const table = document.querySelector(".table")
const jobName= document.querySelector("#new-job-name")
const jobPrio = document.querySelector("#job-prio-list")
const jobCount = document.querySelector("#job-count")
const searchPrio = document.querySelector("#search-prio")
const searchField = document.querySelector("#search-field")
const app = document.querySelector("#app")
const jobEntry = document.querySelector(".job-entry")
let data = []
let unFilteredList = []
let filteredList = []
let filteredText = ""
let filteredPrio = ""
let selectedTableItem
let selectedTableText
let selectedItemPrio


function sortMethod(arr){
    let arr1 = arr
    arr = []
    arr1.forEach(item=>{
        if(item.jobPriority == "urgent"){
            arr.push(item)
        }
    })
    arr1.forEach(item=>{
        if(item.jobPriority == "regular"){
            arr.push(item)
        }
    })
    arr1.forEach(item=>{
        if(item.jobPriority == "trivial"){
            arr.push(item)
        }
    })
    return arr
}

import JobsData from "./JobsData.js";

class Handler{
    static controle() {
        if (JSON.parse(localStorage.getItem("list") !== null)){
        data = JSON.parse(localStorage.getItem("list"))}
        unFilteredList = JobsData.concat(data)
        unFilteredList = sortMethod(unFilteredList)
    }

    static saveItem(){
        localStorage.setItem("list",JSON.stringify(data))
    }
    static changeItemText(jobId, newJobName){
        data.find(item => {
            if(item.id === jobId){
                item.jobText = newJobName
            }
        this.saveItem()
        })
    }
    static changeItemPrio(jobId, newJobPrio){
        
        data.find(item=>{
            if(item.id===jobId){
                
                item.jobPriority = newJobPrio
            }
            this.saveItem()
        })
    }
}

class Job{
    constructor(jobText, jobPriority, id){
        this.id = id
        this.jobText = jobText;
        this.jobPriority = jobPriority;
    }
}

class UI{
    static jobCounter(list){
        const totalJobs = unFilteredList.length
        const shownJobs = list.length
        jobCount.innerHTML = `${shownJobs}/${totalJobs} Jobs`
    }
    static showItems(list) {
        list.forEach(job => {
            const job1 = new Job(job.jobText, job.jobPriority, job.id)
            this.createItem(job1)
        });
        this.jobCounter(list)
    }
    static displayListOnUI(arr){
        this.clearItems()
        arr.forEach(item =>{
            this.createItem(item)
        })
        this.jobCounter(arr)
    }
    static deleteItem(e){
        const deleteBtn = e.target.classList[1]
        if(deleteBtn==="fa-trash-can"){
            const tableItem =e.target.parentElement.parentElement.parentElement
            const itemId =tableItem.id
            table.removeChild(tableItem)
            const found = data.find(item => item.id == itemId)
            console.log(itemId, found)
            if (found !== undefined){ 
            console.log(found)
            const indexNumber = data.indexOf(found)
            data.splice(indexNumber, 1)
            localStorage.setItem("list", JSON.stringify(data))}    
            
        }
    }

    static createItem(job){
        const tableItem = document.createElement("div");
        tableItem.classList.add("shown");
        tableItem.classList.add("table-item");
        tableItem.setAttribute("id", job.id)
        tableItem.innerHTML = `
          <p>${job.jobText}</p>
          <p class="prio-${job.jobPriority}">${job.jobPriority}</p>
          <div class="action-item">
          <a><i class="fa-solid fa-pen-to-square"></i></a>
          <a><i class="fa-solid fa-trash-can"></i></a>
          </div>
          `;
      table.appendChild(tableItem);
      this.clearItem()
    }
    static addItem(job){
        data.push(job)
        Handler.saveItem()
        this.createItem(job)
        Handler.controle()
        UI.displayListOnUI(unFilteredList)
    }
    static clearItem(){
        jobName.value=""
        jobPrio.value=0
    }
    static filterItems(e){

        if (e.target.id === searchField.id){
            filteredText=e.target.value
        }else{
            filteredPrio = e.target.value
        }
        filteredList = unFilteredList.filter(item =>{
            if(filteredPrio==""){
                return item.jobText.toLowerCase().includes(filteredText.toLowerCase())
            }else{
                return item.jobText.toLowerCase().includes(filteredText.toLowerCase())&&item.jobPriority.toLowerCase()==(filteredPrio.toLowerCase())
            }
        }
        )         

        filteredList = sortMethod(filteredList)
        UI.displayListOnUI(filteredList)
    }
   

    static clearItems(){
            table.innerHTML=
            `<div class="table-item table-head">
            <p>Name</p>
            <p class="prio">Priority</p>
            <p class="action">Action</p>
          </div>`
}
    static editWindow(e){
        const editBtn = e.target.classList[1]
        selectedTableItem =e.target.parentElement.parentElement.parentElement
        selectedTableText = selectedTableItem.firstChild.nextSibling.innerText
        selectedItemPrio = selectedTableItem.firstElementChild.nextElementSibling.innerText
        if (editBtn === "fa-pen-to-square"){
            const editBackground = document.createElement("div")
            editBackground.classList.add("edit-background")
            const editWindow = document.createElement("div")
            editWindow.classList.add("edit-window")
            editWindow.innerHTML = `<i id="edit-header" class="fa-regular fa-pen-to-square"></i>
            <h1 id="edit-headline">Job Edit</h1>
            <p>Job Name</p>
            <textarea rows="3" cols="35" wrap="soft" class="edit-text" type="text">${selectedTableText}</textarea>           
            <p>Job Priority</p>
            <select class="edit-prio">
            <option id="urgent" value="urgent">Urgent</option>
            <option id="regular" value="regular">Regular</option>
            <option id="trivial" value="trivial">Trivial</option>
            </select>
            <div class="edit-buttons">
            <button id="save-btn">Save</button>
            <button id="cancel-btn">Cancel</button>
            </div>
          `
            console.log(editWindow.childNodes)
            const selectedPrios = editWindow.childNodes[10].childNodes
            selectedPrios.forEach(item=>{
                if(item.value==selectedItemPrio){
                    item.setAttribute("selected", "selected")
                }
            })

            editBackground.appendChild(editWindow)
            app.appendChild(editBackground)
            
        }

    }
    static handleEditWindow(e){
        const btnPressed = e.target.innerText
        const editBackground = document.querySelector(".edit-background")
        const editText = document.querySelector(".edit-text")
        const editPrio = document.querySelector(".edit-prio")
        const jobId = parseInt(selectedTableItem.id)
        if ( btnPressed === "Cancel"){
            
            app.removeChild(editBackground)
        }else if(btnPressed ==="Save"){
            unFilteredList.find(item => {
                if (item.id === jobId ){
                    item.jobText = editText.value
                    item.jobPriority = editPrio.value
                }
            })
            // selectedTableItem.firstChild.nextSibling.innerText = editText.value
            // selectedTableItem.firstElementChild.nextElementSibling.innerHTML = editPrio.value
            
            Handler.changeItemText(jobId, editText.value)
            Handler.changeItemPrio(jobId, editPrio.value)
            app.removeChild(editBackground)
            unFilteredList = sortMethod(unFilteredList)
            UI.displayListOnUI(unFilteredList)
        }
    }

    static editItem(e){
        UI.editWindow(e)
        const editWindowUI = document.querySelector(".edit-buttons")
        editWindowUI.addEventListener("click", UI.handleEditWindow)
    }
    static createButton(){
        if (jobName.value=="" || jobPrio.value=="0"){
            crtBtn.setAttribute("disabled","")
        }else{
            crtBtn.removeAttribute("disabled")
        }
    }
}





crtBtn.addEventListener("click", (e) =>{
    if (e.target === crtBtn){
        const job = new Job(jobName.value, jobPrio.value, Math.floor(Math.random()*1000000))
        UI.addItem(job)
        UI.createButton()
    }
})
Handler.controle()
addEventListener("DOMContentLoaded", UI.showItems(unFilteredList));

searchField.addEventListener("input", UI.filterItems)
searchPrio.addEventListener("input", UI.filterItems)
table.addEventListener("click",UI.deleteItem)
table.addEventListener("click",UI.editItem)
jobName.addEventListener("input", UI.createButton)
jobPrio.addEventListener("input", UI.createButton)