

// 1 secs = 6 days in game. -> 1 sec jump 6 ticks

function fmtMSS(s) { return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s }

function init() {
  const xTicks = [];
  const yTicks = [];
  const xRate = 1080 / 360; // 1080 -> board width; 360 days (renewal)
  const yRate = 750 / 30; // 750 -> board height; 30 days (contacted)
  const bubbleColors = ['green', 'red', 'yellow'];
  let moveBubbelInterval;
  const limitTime = 120;

  // Generate xTicks
  for (let i = 1; i <= 360; i++) {
    xTicks.push({ label: i });
  }

  // Generate yTicks
  for (let i = 1; i <= 30; i++) {
    yTicks.push({ label: i });
  }

  new Vue({
    el: '#app',
    data() {
      return {
        customers: [
          { id: 1, name: 'B1', health: 1, remainingDays: 214, lastContacted: 5 },
          { id: 2, name: 'B2', health: 0, remainingDays: 38, lastContacted: 22 },
          { id: 3, name: 'B3', health: 7, remainingDays: 163, lastContacted: 3 },
          { id: 4, name: 'B4', health: 4, remainingDays: 307, lastContacted: 11 },
          { id: 5, name: 'B5', health: 7.5, remainingDays: 56, lastContacted: 15 },
          { id: 6, name: 'B6', health: 8, remainingDays: 287, lastContacted: 19 },
          { id: 7, name: 'B7', health: 2.5, remainingDays: 250, lastContacted: 9 },
          { id: 8, name: 'B8', health: 9, remainingDays: 331, lastContacted: 5 },
          { id: 9, name: 'B9', health: 10, remainingDays: 228, lastContacted: 19 },
          { id: 10, name: 'BX', health: 3, remainingDays: 293, lastContacted: 7 },
        ],

        xTicks,
        yTicks,
        tick: 0,
        trackAltClicked: 0
      }
    },
    computed: {
      bubbles() {
        return this.customers.map(c => {
          const { health, remainingDays, lastContacted } = c;
          const healthColorIdx = health > 7.5 ? 0 : health > 3.5 ? 1 : 2;
          const color = bubbleColors[healthColorIdx];
          return {
            ...c,
            position: {
              x: (360 - remainingDays) * xRate,
              y: lastContacted * yRate
            },
            display: lastContacted < 30 || health < 3.5,
            color
          };
        })
      },

      timer() {
        return fmtMSS(this.tick);
      }
    },
    methods: {
      moveBubbles() {
        this.customers = [...this.customers.map(c => {
          const { remainingDays, lastContacted, health } = c;
          const hChanges = this.randomHealthChanges();
          let nextHeath = health + hChanges;
          if (nextHeath > 10) {
            nextHeath = 0;
          }
          // if (nextHeath < 3.5) {
          //   nextHeath = 3.5;
          // }
          return {
            ...c,
            remainingDays: remainingDays <= 0 ? 360 : remainingDays - 6,
            lastContacted: lastContacted + 6,
            health: nextHeath
          }
        })];
      },

      handleBubbleClick(_, idx, $event) {
        const customers = this.customers;
        const { altKey } = $event;
        if (!altKey) {
          // Reset last contacted
          if (this.tick < limitTime) {
            customers[idx].lastContacted = 0;
          }
        } else {
          // change health
          const diff = this.tick - this.trackAltClicked;
          if (diff >= 2) {
            customers[idx].health += 3;
          }
        }
      },

      randomHealthChanges() {
        const sign = Math.round(Math.random()) ? 1 : -1;
        const changes = Math.round(Math.random() * 10) / 10;
        return changes * sign;
      }
    },

    mounted() {
      moveBubbelInterval = setInterval(() => {
        if (++this.tick >= limitTime) {
          clearInterval(moveBubbelInterval);
        } else {
          this.moveBubbles();
        }
      }, 1000);
    }
  });
}


window.onload = function () {
  init();
}
