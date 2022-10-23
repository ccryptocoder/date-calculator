'use strict';

window.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('[data-form]');
    const dateInput = form.querySelector('[type=date]');

    const days = document.querySelector('[data-timer-days]');
    const hours = document.querySelector('[data-timer-hours]');
    const minutes = document.querySelector('[data-timer-minutes]');
    const seconds = document.querySelector('[data-timer-seconds]');

    function addEventListeners(events, element, callback) {
        events.forEach(event => {
            element.addEventListener(event, () => {
                callback();
            })
        })
    }

    // open date picker when clicked anywhere on the input
    addEventListeners(['click', 'touch'], dateInput, () => {
        dateInput.showPicker();
    })

    // set current day as default
    const currentDate = new Date();
    
    function setDefault() {
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1 < 10 ? '0' + Number(currentDate.getMonth() + 1) : Number(currentDate.getMonth() + 1);  
        const currentDay = currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate();  
    
        dateInput.value = `${currentYear}-${currentMonth}-${currentDay}`;
        dateInput.min = `${currentYear}-${currentMonth}-${currentDay}`;
    }

    setDefault();

    // get remaining time
})