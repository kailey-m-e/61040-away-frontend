<template>
  <div class="auth-layout">
    <div class="auth-layout__container">
      <div class="auth-layout__header">
        <div class="auth-layout__logo">
          <img src="/src/assets/vue.svg" alt="Away" class="auth-layout__logo-image" />
          <h1 class="auth-layout__title">Away</h1>
        </div>
      </div>

      <div class="auth-layout__content">
        <div class="auth-layout__form-container">
          <slot />
        </div>
      </div>

      <div class="auth-layout__footer">
        <slot name="footer">
          <p class="auth-layout__footer-text">
            Already have an account?
            <router-link to="/login" class="auth-layout__link">Sign in</router-link>
          </p>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props needed for this layout component
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.auth-layout__container {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.auth-layout__header {
  padding: 2rem 2rem 1rem;
  text-align: center;
  background: linear-gradient(135deg, #42b883 0%, #369870 100%);
  color: white;
}

.auth-layout__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.auth-layout__logo-image {
  width: 2rem;
  height: 2rem;
}

.auth-layout__title {
  font-size: 1.875rem;
  font-weight: 700;
  margin: 0;
}

.auth-layout__subtitle {
  font-size: 0.875rem;
  opacity: 0.9;
  margin: 0;
}

.auth-layout__content {
  padding: 2rem;
}

.auth-layout__form-container {
  width: 100%;
}

.auth-layout__footer {
  padding: 1rem 2rem 2rem;
  text-align: center;
  background-color: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.auth-layout__footer-text {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.auth-layout__link {
  color: #42b883;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.auth-layout__link:hover {
  color: #369870;
  text-decoration: underline;
}

@media (max-width: 640px) {
  .auth-layout {
    padding: 0.5rem;
  }

  .auth-layout__container {
    max-width: none;
    border-radius: 0.5rem;
  }

  .auth-layout__header,
  .auth-layout__content,
  .auth-layout__footer {
    padding: 1.5rem;
  }
}
</style>
