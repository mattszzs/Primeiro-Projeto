// Espera o DOM ser totalmente carregado
document.addEventListener("DOMContentLoaded", function () {

  // Define o ano atual no rodapé
  const currentYearSpan = document.getElementById("currentYear");
  if (currentYearSpan) {
      const year = new Date().getFullYear();
      currentYearSpan.textContent = year;
      const footerText = document.querySelector("footer p");
      if(footerText && footerText.textContent.includes('2025')) {
           footerText.innerHTML = `&copy; ${year} Sunset Titans. Todos os direitos reservados.`;
      } else if (footerText) {
           footerText.innerHTML = `&copy; <span id="currentYear">${year}</span> Sunset Titans. Todos os direitos reservados.`;
      }
  }

  // --- Mensagem de Boas-Vindas ---
  const boasVindas = document.getElementById("boasVindas");
  if (boasVindas) {
      const hora = new Date().getHours();
      let saudacao = "";
      if (hora>= 5  && hora < 12) { saudacao = "Bom dia!"; }
      else if (hora >= 12 && hora < 18) { saudacao = "Boa tarde!"; }
      else { saudacao = "Boa noite!"; }
      boasVindas.textContent = `${saudacao} Seja bem-vindo ao Sunset Titans!`;
  }

  // --- Variável do Carrinho (LOCAL a este escopo) ---
  let cart = [];
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  // --- Ouvinte de Evento para Adicionar ao Carrinho (Usando Delegação de Eventos) ---
  const shopSection = document.getElementById('camisas');
  if (shopSection) {
      shopSection.addEventListener('click', function(event) {
          if (event.target.classList.contains('buy-btn')) {
              const button = event.target;
              const produto = button.dataset.produto;
              const preco = parseFloat(button.dataset.preco);
              if (produto && !isNaN(preco)) {
                   addToCart(produto, preco);
              } else {
                  console.error("Faltando dados do produto no botão:", button);
                  alert("Erro ao adicionar item. Tente novamente.");
              }
          }
      });
  }

  // --- Ouvinte de Evento para Associar-se (Usando Delegação de Eventos) ---
  const sociosSection = document.getElementById('socios');
  if (sociosSection) {
      sociosSection.addEventListener('click', function(event) {
           if (event.target.classList.contains('join-member-btn')) {
              const button = event.target;
              const plano = button.dataset.plan;
              if (plano) {
                  showJoinMessage(plano);
              } else {
                  console.error("Faltando dados do plano no botão:", button);
              }
          }
      });
  }

  // --- Funções do Carrinho (Definidas DENTRO do DOMContentLoaded) ---

  function addToCart(produto, preco) {
      console.log("Adicionando:", produto, preco); // Debug
      cart.push({ produto, preco }); // Modifica o 'cart' LOCAL
      console.log("Carrinho local após adicionar:", cart); // Debug
      updateCart();
      openModal("cart-modal", `"${produto}" adicionado ao carrinho!`);
      setTimeout(() => { closeModal('cart-modal'); }, 3000);
  }

  function updateCart() {
      console.log("Atualizando exibição do carrinho. Itens:", cart.length); // Debug
      if (!cartItems || !cartTotal) return;
      cartItems.innerHTML = "";
      let total = 0;
      if (cart.length === 0) {
          cartItems.innerHTML = "<li class='cart-empty-message'>Seu carrinho está vazio.</li>";
      } else {
          cart.forEach((item, index) => { // Lê o 'cart' LOCAL
              const li = document.createElement("li");
              li.textContent = `${item.produto} - R$ ${item.preco.toFixed(2)}`;
              const removeBtn = document.createElement("button");
              removeBtn.textContent = "X";
              removeBtn.title = `Remover ${item.produto}`;
              removeBtn.onclick = () => {
                  cart.splice(index, 1); // Modifica o 'cart' LOCAL
                  updateCart();
              };
              removeBtn.style.cssText = 'padding: 0.2rem 0.5rem; font-size: 0.8rem; margin-left: 0.5rem; background-color: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer;';
              li.appendChild(removeBtn);
              cartItems.appendChild(li);
              total += item.preco;
          });
      }
      cartTotal.textContent = total.toFixed(2);
  }

  // --- Função Checkout (Definida DENTRO do DOMContentLoaded) ---
  function checkout() {
      console.log("Checkout chamado. Verificando carrinho LOCAL. Tamanho:", cart.length); // Debug
      // 1. Verifica o carrinho LOCAL
      if (cart.length === 0) {
          alert("Seu carrinho está vazio.");
      } else {
          alert(`Compra finalizada! Total: R$ ${document.getElementById("cart-total").textContent}. Obrigado!`);
          // 2. Limpa o array LOCAL diretamente
          cart.length = 0; // Esvazia o array mantendo a referência
          // 3. Atualiza a exibição usando o carrinho local (agora vazio)
          updateCart();
      }
  }

  // --- Atribui funções ao escopo global para onclick e chamadas externas ---
  window.updateCart = updateCart; // Permite chamar window.updateCart de fora se necessário
  window.checkout = checkout;     // Permite que onclick="checkout()" funcione

  // --- Manipulação do Formulário de Login ---
  const loginForm = document.getElementById("loginForm");
  const loginMsg = document.getElementById("loginMsg");
  if (loginForm) {
      loginForm.addEventListener("submit", function(event) {
          event.preventDefault();
          const email = document.getElementById("email").value;
          const senha = document.getElementById("senha").value;
          if (!loginMsg) return;
          if (email === "usuario@sunsettitans.com" && senha === "senha123") {
              loginMsg.style.color = "lime";
              loginMsg.textContent = "Login bem-sucedido! Redirecionando...";
              setTimeout(() => {
                   closeModal('loginModal');
                   alert("Login realizado com sucesso!");
                   loginForm.reset();
                   loginMsg.textContent = "";
              }, 1500);
          } else {
              loginMsg.style.color = "#ff4d4d";
              loginMsg.textContent = "Credenciais inválidas. Tente novamente.";
          }
      });
  }

  // --- Atualização inicial do carrinho ---
  updateCart();

}); // Fim do DOMContentLoaded

// --- Funções Globais (que não dependem do escopo do DOMContentLoaded) ---

function toggleMenu() {
  const navMenu = document.getElementById("nav-menu");
  const toggleButton = document.querySelector(".menu-toggle");
  if (navMenu && toggleButton) {
      navMenu.classList.toggle("active");
      const isExpanded = navMenu.classList.contains("active");
      toggleButton.setAttribute("aria-expanded", isExpanded);
  }
}

function openModal(modalId, message = "") {
  const modal = document.getElementById(modalId);
  if (modal) {
      const messageElement = modal.querySelector("p[id$='essage']");
      if (messageElement && message) {
          messageElement.textContent = message;
      }
      modal.style.display = "block";
      modal.setAttribute("aria-hidden", "false");
      const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusableElements.length > 0) {
           if (modalId === 'loginModal') {
               const emailInput = modal.querySelector('#email');
               if (emailInput) emailInput.focus();
           } else {
              if (focusableElements[0] !== modal.querySelector('.modal-content')) {
                 focusableElements[0].focus();
              } else if (focusableElements.length > 1) {
                 focusableElements[1].focus();
              }
           }
      }
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
      modal.style.display = "none";
      modal.setAttribute("aria-hidden", "true");
  }
}

function showJoinMessage(plano) {
  const message = `Você escolheu o ${plano}. Bem-vindo ao time de Sócios Sunset Titans! Em breve entraremos em contato.`;
  openModal('joinModal', message);
  setTimeout(() => { closeModal('joinModal'); }, 4000);
}

function triggerLoginModal() {
  const loginMsg = document.getElementById("loginMsg");
   if(loginMsg) loginMsg.textContent = "";
  openModal('loginModal');
}

window.addEventListener('click', function(event) {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
      if (event.target == modal) {
          closeModal(modal.id);
      }
  });
});
const jogadores = [
    {
      nome: "Lucas Almeida",
      posicao: "Goleiro",
      imagem: "imagens/jogador1.png",
      partidas: 91,
      gols: 2,
      assistencias: 4,
      amarelos: 5,
      vermelhos: 0
    },
    {
      nome: "Carlos Santos",
      posicao: "Lateral Direito",
      imagem: "imagens/jogador2.png",
      partidas: 78,
      gols: 4,
      assistencias: 7,
      amarelos: 3,
      vermelhos: 1
    },
    {
      nome: "Pedro Costa",
      posicao: "Zagueiro",
      imagem: "imagens/jogador3.png",
      partidas: 80,
      gols: 3,
      assistencias: 1,
      amarelos: 14,
      vermelhos: 2
    },
    {
      nome: "Thiago Oliveira",
      posicao: "Zagueiro",
      imagem: "imagens/jogador4.png",
      partidas: 89,
      gols: 4,
      assistencias: 0,
      amarelos: 20,
      vermelhos: 1
    },
    {
      nome: "Rafael Lima",
      posicao: "Lateral Esquerdo",
      imagem: "imagens/jogador5.png",
      partidas: 73,
      gols: 5,
      assistencias: 11,
      amarelos: 1,
      vermelhos: 1
    },
    {
      nome: "Gustavo Pereira",
        posicao: "Volante",
        imagem: "imagens/jogador6.png",
        partidas: 90,
        gols: 10,
        assistencias: 6,
        amarelos: 18,
        vermelhos: 4
    },

    {
     nome: "Felipe Martins",
      posicao: "Meio campo",
      imagem: "imagens/jogador7.png",
      partidas: 75,
      gols: 24,
      assistencias: 12,
      amarelos: 4,
      vermelhos: 0
    },
     {
      nome: "André Souza",
      posicao: "Meio campo",
      imagem: "imagens/jogador8.png",
      partidas: 95,
      gols: 32,
      assistencias: 45,
      amarelos: 2,
      vermelhos: 0
    },
    {
      nome: "Alex Santino",
      posicao: "Ponta esquerda",
      imagem: "imagens/jogador9.png",
      partidas: 47,
      gols: 30,
      assistencias: 19,
      amarelos: 1,
      vermelhos: 0
     },
     {
      nome: "Ricardo Gomes",
      posicao: "Ponta direita",
      imagem: "imagens/jogador10.png",
      partidas: 58,
      gols: 15,
      assistencias: 11,
      amarelos: 3,
      vermelhos: 0
     },
    {
      nome: "João Silva",
      posicao: "Centroavante",
      imagem: "imagens/jogador11.png",
      partidas: 120,
      gols: 78,
      assistencias: 27,
      amarelos: 11,
      vermelhos: 2
    },
  ];
  
  let jogadorIndex = 0; // Posição inicial do carrossel

function renderizarJogadores() {
  const container = document.getElementById('carousel-slide');
  container.innerHTML = "";

  jogadores.forEach(jogador => {
    const card = document.createElement('div');
    card.className = 'player-card';
    card.innerHTML = `
      <img src="${jogador.imagem}" alt="${jogador.nome}">
      <h3>${jogador.nome}</h3>
      <p><strong>Posição:</strong> ${jogador.posicao}</p>
      <p><strong>Partidas:</strong> ${jogador.partidas}</p>
      <p><strong>Gols:</strong> ${jogador.gols}</p>
      <p><strong>Assistências:</strong> ${jogador.assistencias}</p>
      <p><strong>Amarelos:</strong> ${jogador.amarelos}</p>
      <p><strong>Vermelhos:</strong> ${jogador.vermelhos}</p>
    `;
    container.appendChild(card);
  });

  atualizarCarrossel(); // Reposiciona na primeira vez
}

function moverCarrossel(direcao) {
  const total = jogadores.length;
  jogadorIndex += direcao;

  if (jogadorIndex < 0) jogadorIndex = total - 1;
  else if (jogadorIndex >= total) jogadorIndex = 0;

  atualizarCarrossel();
}

function atualizarCarrossel() {
  const container = document.getElementById('carousel-slide');
  const cardWidth = 320; // Largura do card + margem
  container.style.transform = `translateX(-${jogadorIndex * cardWidth}px)`;
}

document.addEventListener('DOMContentLoaded', renderizarJogadores);

  