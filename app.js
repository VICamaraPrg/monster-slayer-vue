const app = Vue.createApp({
  data() {
    return {
      monsterHealth: 100,
      playerHealth: 100,
      currentTurn: 0,
      winner: null,
      combatLog: [],
    };
  },
  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        this.winner = "Draw";
      } else if (value <= 0) {
        this.winner = "Monster";
      }
    },
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        this.winner = "Draw";
      } else if (value <= 0) {
        this.winner = "Player";
      }
    },
  },
  computed: {
    playerHealthbarStyle() {
      if (this.playerHealth <= 0) {
        return { width: "0%" };
      }
      return { width: this.playerHealth + "%" };
    },
    monsterHealthbarStyle() {
      if (this.monsterHealth <= 0) {
        return { width: "0%" };
      }
      return { width: this.monsterHealth + "%" };
    },
    isSuperAttackAvailable() {
      return this.currentTurn % 3 !== 0;
    },
  },
  methods: {
    startGame() {
      this.monsterHealth = 100;
      this.playerHealth = 100;
      this.winner = null;
      this.currentTurn = 0;
      this.combatLog = [];
    },

    addLogRecord(who, type, value) {
      this.combatLog.unshift({
        actionWho: who,
        actionType: type,
        actionValue: value,
      });
    },

    surrender() {
      this.winner = "Monster";
      this.playerHealth = 0;
    },

    // Player attacks the monster and will recieve the monster's attack as well.
    playerAttack() {
      const playerDamage = this.generateStat(12, 18);
      this.currentTurn++;
      this.monsterHealth -= playerDamage;
      this.monsterAttack();
      this.addLogRecord("player", "attack", playerDamage);
    },

    monsterAttack() {
      const monsterDamage = this.generateStat(10, 15);
      this.playerHealth -= monsterDamage;
      this.addLogRecord("monster", "attack", monsterDamage);
    },

    playerSuperAttack() {
      const monsterDamage = this.generateStat(10, 15);
      const playerDamage = this.generateStat(20, 30);
      this.currentTurn++;
      this.playerHealth -= monsterDamage;
      this.monsterHealth -= playerDamage;
      this.addLogRecord("player", "super-attack", playerDamage);
      this.addLogRecord("monster", "attack", monsterDamage);
    },

    // As the player's health is linked up with the width of the element, we don't want to exceed 100%.
    // The monster won't attack if the player is healing.
    playerHeal() {
      this.currentTurn++;

      const healthRecover = this.generateStat(10, 15);
      if (this.playerHealth + healthRecover > 100) {
        this.playerHealth = 100;
      } else {
        this.playerHealth += healthRecover;
      }
      this.addLogRecord("player", "heal", healthRecover);
    },

    // A stat will be used so the player can attack and heal within the same range.
    generateStat(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },
  },
});

app.mount("#monster-slayer");
