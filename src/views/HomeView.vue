<template>
  <div class="home">
    <h1>Welcome to Away!</h1>
    <p>Your travel documentation app is working.</p>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

const increment = () => {
  count.value++
}
</script>

<style scoped>
.home {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

h1 {
  color: #ff6b6b;
  margin-bottom: 1rem;
  font-size: 3rem;
  font-weight: 700;
}

p {
  font-size: 1.25rem;
  color: #64748b;
  margin-bottom: 2rem;
  text-align: center;
}

button {
  background-color: #ff6b6b;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  cursor: pointer;
  margin-top: 1rem;
  font-size: 1.125rem;
  font-weight: 600;
  transition: all 0.2s;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

button:hover {
  background-color: #ff5252;
  transform: translateY(-2px);
  box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .home {
    padding: 1rem;
  }

  h1 {
    font-size: 2rem;
  }

  p {
    font-size: 1rem;
  }
}
</style>
