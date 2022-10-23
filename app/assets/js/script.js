'use strict';

window.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('[data-form]');
    const dateInput = form.querySelector('[type=date]');

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

    // set current day as default and min
    const currentDate = new Date();
    
    function setDefault() {
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1 < 10 ? '0' + Number(currentDate.getMonth() + 1) : Number(currentDate.getMonth() + 1);  
        const currentDay = currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate();  
    
        dateInput.value = `${currentYear}-${currentMonth}-${currentDay}`;
        dateInput.min = `${currentYear}-${currentMonth}-${currentDay}`;
    }

    setDefault();

    // get end date
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const deadline = dateInput.value;
        setTimer(deadline);
    });

    // get remaining time
    function getRemainingTime(deadline) {
        const t = Date.parse(deadline) - Date.parse(new Date()); // get difference in ms
        const days = Math.floor(t / (1000 * 60 * 60 * 24));
        const hours = Math.floor(t / (1000 * 60 * 60) % 24);
        const minutes = Math.floor(t / (1000 * 60) % 60);
        const seconds = Math.floor(t / 1000 % 60);
        
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        }
    }

    const days = document.querySelector('[data-timer-days]');
    const hours = document.querySelector('[data-timer-hours]');
    const minutes = document.querySelector('[data-timer-minutes]');
    const seconds = document.querySelector('[data-timer-seconds]');
    
    function setTimer(deadline) {

        updateTimer();

        const timeInterval = setInterval(updateTimer, 1000);

        function updateTimer() {
            const t = getRemainingTime(deadline);
            days.textContent = t.days;
            hours.textContent = t.hours;
            minutes.textContent = t.minutes;
            seconds.textContent = t.seconds;

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }


})