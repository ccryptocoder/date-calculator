'use strict';

window.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('[data-form]');
    const dateInput = form.querySelector('[type=date]');
    const resetBtn = document.querySelector('[data-reset-date]');

    resetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.clear();
        window.location.reload();
    })

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
    
        dateInput.value = `${currentYear}-${currentMonth}-${currentDay + 1}`;
        dateInput.min = `${currentYear}-${currentMonth}-${currentDay + 1}`;
    }

    setDefault();

    const previousInput = localStorage.getItem('deadline');

    if (previousInput) {
        setTimer(previousInput);
        dateInput.value = previousInput;
    }

    // get end date
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const deadline = dateInput.value;
        localStorage.setItem('deadline', deadline);
        setTimer(deadline);
    });

    // get remaining time
    function getRemainingTime(deadline) {
        const timezoneOffset = currentDate.getTimezoneOffset();
        const t = Date.parse(deadline) - Date.parse(new Date()); // get difference in ms
        let days, hours, minutes, seconds;

        if (t > 0) {
            let minutesOffset;
            if (Math.abs(timezoneOffset) % 60 == 30) {
                minutesOffset = Math.abs(timezoneOffset) % 60;
            } else if (Math.abs(timezoneOffset) % 60 == 45) {
                minutesOffset = 15;
            } else if (Math.abs(timezoneOffset) % 60 == 15) {
                minutesOffset = 15;
            } else {
                minutesOffset = 0;
            }
            days = Math.floor(t / (1000 * 60 * 60 * 24));
            hours = Math.floor( (t / (1000 * 60 * 60) + timezoneOffset / 60) % 24);
            minutes = Math.floor( (t / (1000 * 60) + minutesOffset) % 60 );
            seconds = Math.floor(t / 1000 % 60);

            if (Math.abs(timezoneOffset) >= 720) {
                days = days - 1;
            }
        } else {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        }
        
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        }
    }

    
    function setTimer(deadline) {
        const days = document.querySelector('[data-timer-days]');
        const hours = document.querySelector('[data-timer-hours]');
        const minutes = document.querySelector('[data-timer-minutes]');
        const seconds = document.querySelector('[data-timer-seconds]');
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

            // reset timer on new submit
            form.addEventListener('submit', () => {
                clearInterval(timeInterval);
            })
        }
    }

})