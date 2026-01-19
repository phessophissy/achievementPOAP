// Achievement POAP Frontend Application
const App = {
  init() {
    this.render();
  },

  render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <header class="header">
        <div class="logo">Achievement POAP</div>
        <nav class="nav">
          <a href="#home">Home</a>
          <a href="#events">Events</a>
          <a href="#my-poaps">My POAPs</a>
        </nav>
        <button class="connect-btn" id="connectBtn">Connect Wallet</button>
      </header>
      <main class="main">
        <section class="hero">
          <h1>Achievement POAP</h1>
          <p>Proof of Attendance on Bitcoin L2</p>
        </section>
      </main>
      <footer class="footer">
        <p>&copy; 2026 Achievement POAP. Built on Stacks.</p>
      </footer>
    `;
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
