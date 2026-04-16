<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<template>
  <footer class="d-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <img src="@/assets/logo/logo-large.png" alt="Dicas" class="footer-logo" />
          <p class="brand-description">
            Empowering visions with strategic excellence. Your trusted partner in financial and business advisory.
          </p>
        </div>
        
        <div class="footer-links">
          <div class="link-group">
            <h4>Quick Links</h4>
            <a href="#hero">Home</a>
            <a href="#services">Services</a>
            <a href="#about">About Us</a>
          </div>
          
          <div class="link-group">
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Security</a>
          </div>
          
          <div class="link-group">
            <h4>Connect</h4>
            <a href="#">LinkedIn</a>
            <a href="#">Twitter</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </div>
      
      <div class="footer-disclaimer">
        <p><strong>IMPORTANT DISCLAIMER:</strong> No somos abogados ni contadores públicos certificados. Los servicios de inmigración son asistencia administrativa. Servicios de seguros sujetos a elegibilidad. Registro de marca sujeto a aprobación del gobierno. Información basada en datos proporcionados por el cliente.</p>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; {{ year }} Dicas Advisor Group. All rights reserved.</p>
        <p>Expertly Designed by ScaleFront</p>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.d-footer {
  background: $primary-dark;
  color: $white;
  padding: 5rem 2rem 2rem;
  border-top: 1px solid rgba($primary, 0.1);

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .footer-grid {
    display: grid;
    grid-template-columns: 1.5fr 3fr;
    gap: 4rem;
    margin-bottom: 4rem;

    @media (max-width: 868px) {
      grid-template-columns: 1fr;
      gap: 3rem;
    }
  }

  .footer-brand {
    .footer-logo {
      height: 40px;
      margin-bottom: 1.5rem;
    }
    
    .brand-description {
      font-family: $font-principal;
      color: rgba($white, 0.6);
      line-height: 1.6;
      max-width: 300px;
    }
  }

  .footer-links {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }

    .link-group {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      h4 {
        font-family: $font-luxury;
        font-size: 1.2rem;
        color: $primary;
        margin-bottom: 0.5rem;
      }

      a {
        text-decoration: none;
        color: rgba($white, 0.6);
        font-family: $font-principal;
        font-size: 0.9rem;
        transition: color 0.3s ease;

        &:hover {
          color: $primary;
        }
      }
    }
  }

  .footer-disclaimer {
    margin-top: 3rem;
    padding: 2rem;
    background: rgba($white, 0.03);
    border-radius: 8px;
    font-family: $font-principal;
    font-size: 0.8rem;
    line-height: 1.5;
    color: rgba($white, 0.4);
    text-align: center;

    strong { color: $primary; }
  }

  .footer-bottom {
    padding-top: 2rem;
    margin-top: 2rem;
    border-top: 1px solid rgba($white, 0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: $font-principal;
    font-size: 0.8rem;
    color: rgba($white, 0.4);

    @media (max-width: 600px) {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }
  }
}
</style>
