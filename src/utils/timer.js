export default class {
    constructor(handler, interval) {
        this.timerId = null;
        this.handler = handler;
        this.interval = interval;
    }

    startTimer() {
        if (this.timerId !== null) {
            this.stopTimer();
        }
        this.timerId = setInterval(this.handler, this.interval);
    }

    stopTimer() {
        clearInterval(this.timerId);
        this.timerId = null;
    }
};