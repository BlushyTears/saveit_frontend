<!-- Spinner.svelte -->
<style>
    .spinner {
      border: 5px solid rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      border-top: 5px solid #000;
      width: 30px;
      height: 30px;
      animation: spin 2s linear infinite;
    }
  
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
  
<div class="spinner"></div>