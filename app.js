const app = Vue.createApp({
  data() {
    return {
      monsterHealth: 100,
      monsterDanger: false,
      playerHealth: 100,
      playerDanger: false,
      currentTurn: 0,
      winner: null,
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
    },
    monsterAttack() {
      const monsterDamage = this.generateStat(10, 15);
      this.playerHealth -= monsterDamage;
    },
    playerSuperAttack() {
      const monsterDamage = this.generateStat(10, 15);
      const playerDamage = this.generateStat(20, 30);
      this.currentTurn++;
      this.playerHealth -= monsterDamage;
      this.monsterHealth -= playerDamage;
    },
    // As the player's health is linked up with the width of the element, we don't want to exceed 100%.
    playerHeal() {
      this.currentTurn++;

      const healthRecover = this.generateStat(10, 15);
      if (this.playerHealth + healthRecover > 100) {
        this.playerHealth = 100;
      } else {
        this.playerHealth += healthRecover;
      }
    },
    // A stat will be used so the player can attack and heal within the same range.
    generateStat(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },
  },
});

app.mount("#monster-slayer");
