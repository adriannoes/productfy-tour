(function() {
  'use strict';

  // Namespace global
  window.TourFlow = window.TourFlow || {};

  // Estado interno
  let state = {
    tourData: null,
    currentStep: 0,
    isActive: false,
    config: {},
    elements: {}
  };

  // Configuração padrão
  const defaultConfig = {
    autoStart: false,
    storageKey: 'tourflow_completed',
    overlay: true,
    highlightPadding: 10,
    scrollBehavior: 'smooth',
    placement: 'auto',
    onComplete: () => {},
    onSkip: () => {},
    onStepChange: () => {}
  };

  // ============= API PÚBLICA =============

  TourFlow.init = async function(options) {
    if (!options.tourId && !options.tourData) {
      console.error('TourFlow: tourId or tourData is required');
      return;
    }

    // Merge configurações
    state.config = { ...defaultConfig, ...options };

    // Verificar se já completou
    if (hasCompletedTour(options.tourId)) {
      console.log('TourFlow: Tour already completed');
      return;
    }

    // Carregar dados do tour
    if (options.tourData) {
      state.tourData = options.tourData;
    } else {
      state.tourData = await fetchTourData(options.tourId);
    }

    if (!state.tourData || !state.tourData.steps || state.tourData.steps.length === 0) {
      console.error('TourFlow: Invalid tour data');
      return;
    }

    // Auto-start
    if (state.config.autoStart) {
      TourFlow.start();
    }

    return TourFlow;
  };

  TourFlow.start = function() {
    if (state.isActive) return;
    
    state.isActive = true;
    state.currentStep = 0;
    createTourElements();
    showStep(0);
    
    // Track tour view
    trackEvent('view');
  };

  TourFlow.stop = function() {
    if (!state.isActive) return;
    
    // Track skip event
    trackEvent('skip', state.currentStep);
    
    state.isActive = false;
    removeTourElements();
    state.config.onSkip(state.currentStep);
  };

  TourFlow.next = function() {
    if (state.currentStep < state.tourData.steps.length - 1) {
      showStep(state.currentStep + 1);
    } else {
      completeTour();
    }
  };

  TourFlow.previous = function() {
    if (state.currentStep > 0) {
      showStep(state.currentStep - 1);
    }
  };

  TourFlow.goToStep = function(index) {
    if (index >= 0 && index < state.tourData.steps.length) {
      showStep(index);
    }
  };

  TourFlow.destroy = function() {
    removeTourElements();
    state = {
      tourData: null,
      currentStep: 0,
      isActive: false,
      config: {},
      elements: {}
    };
  };

  TourFlow.reset = function() {
    const tourId = state.tourData?.id;
    if (tourId) {
      localStorage.removeItem(state.config.storageKey);
      console.log('TourFlow: Tour reset, can be shown again');
    }
  };

  // ============= FUNÇÕES INTERNAS =============

  // Tracking functions
  async function trackEvent(eventType, stepIndex = null, metadata = {}) {
    if (!state.tourData || !state.tourData.id) return;
    
    try {
      const userId = getUserIdentifier();
      
      await fetch(
        'https://sfokolgauqfppgymcyae.supabase.co/functions/v1/track-event',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tourId: state.tourData.id,
            eventType,
            stepIndex,
            userIdentifier: userId,
            metadata
          })
        }
      );
    } catch (error) {
      console.warn('TourFlow: Failed to track event', error);
    }
  }

  function getUserIdentifier() {
    const key = 'tourflow_user_id';
    let userId = localStorage.getItem(key);
    
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9) + Date.now();
      localStorage.setItem(key, userId);
    }
    
    return userId;
  }

  async function fetchTourData(tourId) {
    try {
      const response = await fetch(
        `https://sfokolgauqfppgymcyae.supabase.co/functions/v1/get-tour?tourId=${tourId}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('TourFlow: Failed to fetch tour data', error);
      return null;
    }
  }

  function createTourElements() {
    // Criar overlay
    if (state.config.overlay) {
      const overlay = document.createElement('div');
      overlay.id = 'tourflow-overlay';
      overlay.className = 'tourflow-overlay';
      document.body.appendChild(overlay);
      state.elements.overlay = overlay;
    }

    // Criar tooltip
    const tooltip = document.createElement('div');
    tooltip.id = 'tourflow-tooltip';
    tooltip.className = 'tourflow-tooltip';
    tooltip.innerHTML = `
      <div class="tourflow-tooltip-header">
        <span class="tourflow-step-counter"></span>
        <button class="tourflow-close" onclick="TourFlow.stop()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <h3 class="tourflow-title"></h3>
      <p class="tourflow-content"></p>
      <div class="tourflow-actions">
        <button class="tourflow-btn tourflow-btn-secondary tourflow-prev" onclick="TourFlow.previous()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          Back
        </button>
        <div class="tourflow-dots"></div>
        <button class="tourflow-btn tourflow-btn-primary tourflow-next" onclick="TourFlow.next()">
          <span class="tourflow-next-text">Next</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>
    `;
    document.body.appendChild(tooltip);
    state.elements.tooltip = tooltip;

    // Criar spotlight
    const spotlight = document.createElement('div');
    spotlight.id = 'tourflow-spotlight';
    spotlight.className = 'tourflow-spotlight';
    document.body.appendChild(spotlight);
    state.elements.spotlight = spotlight;
  }

  function showStep(index) {
    state.currentStep = index;
    const step = state.tourData.steps[index];
    const isFirst = index === 0;
    const isLast = index === state.tourData.steps.length - 1;

    // Track step view
    trackEvent('step_view', index, { target: step.target });

    // Atualizar conteúdo do tooltip
    state.elements.tooltip.querySelector('.tourflow-step-counter').textContent = 
      `${index + 1} of ${state.tourData.steps.length}`;
    state.elements.tooltip.querySelector('.tourflow-title').textContent = step.title;
    state.elements.tooltip.querySelector('.tourflow-content').textContent = step.content;

    // Atualizar botão "Next" ou "Done"
    const nextBtn = state.elements.tooltip.querySelector('.tourflow-next');
    const nextText = nextBtn.querySelector('.tourflow-next-text');
    nextText.textContent = isLast ? 'Done' : 'Next';

    // Desabilitar botão "Back" no primeiro step
    const prevBtn = state.elements.tooltip.querySelector('.tourflow-prev');
    prevBtn.disabled = isFirst;
    prevBtn.style.opacity = isFirst ? '0.5' : '1';

    // Atualizar dots de progresso
    updateProgressDots();

    // Encontrar elemento target
    const targetElement = document.querySelector(step.target);
    
    if (targetElement) {
      // Scroll para o elemento
      targetElement.scrollIntoView({
        behavior: state.config.scrollBehavior,
        block: 'center'
      });

      // Highlight do elemento
      highlightElement(targetElement);

      // Posicionar tooltip
      positionTooltip(targetElement, step.placement);
    } else {
      console.warn(`TourFlow: Target element not found: ${step.target}`);
      // Posicionar tooltip no centro
      centerTooltip();
    }

    // Callback
    state.config.onStepChange(step, index);
  }

  function highlightElement(element) {
    const rect = element.getBoundingClientRect();
    const padding = state.config.highlightPadding;

    state.elements.spotlight.style.top = `${rect.top - padding + window.scrollY}px`;
    state.elements.spotlight.style.left = `${rect.left - padding}px`;
    state.elements.spotlight.style.width = `${rect.width + padding * 2}px`;
    state.elements.spotlight.style.height = `${rect.height + padding * 2}px`;
    state.elements.spotlight.style.display = 'block';
  }

  function positionTooltip(targetElement, placement) {
    const rect = targetElement.getBoundingClientRect();
    const tooltip = state.elements.tooltip;
    const tooltipRect = tooltip.getBoundingClientRect();

    let top, left;

    // Calcular posição baseada no placement
    switch (placement) {
      case 'top':
        top = rect.top - tooltipRect.height - 20;
        left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'bottom':
        top = rect.bottom + 20;
        left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'left':
        top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
        left = rect.left - tooltipRect.width - 20;
        break;
      case 'right':
        top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
        left = rect.right + 20;
        break;
      default:
        // Auto - escolher melhor posição
        if (rect.bottom + tooltipRect.height + 20 < window.innerHeight) {
          return positionTooltip(targetElement, 'bottom');
        } else if (rect.top - tooltipRect.height - 20 > 0) {
          return positionTooltip(targetElement, 'top');
        } else {
          centerTooltip();
          return;
        }
    }

    // Ajustar se sair da viewport
    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) {
      left = window.innerWidth - tooltipRect.width - 10;
    }
    if (top < 10) top = 10;

    tooltip.style.top = `${top + window.scrollY}px`;
    tooltip.style.left = `${left}px`;
    tooltip.style.transform = 'none';
  }

  function centerTooltip() {
    const tooltip = state.elements.tooltip;
    tooltip.style.top = '50%';
    tooltip.style.left = '50%';
    tooltip.style.transform = 'translate(-50%, -50%)';
  }

  function updateProgressDots() {
    const dotsContainer = state.elements.tooltip.querySelector('.tourflow-dots');
    dotsContainer.innerHTML = '';

    state.tourData.steps.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.className = `tourflow-dot ${index === state.currentStep ? 'active' : ''}`;
      dotsContainer.appendChild(dot);
    });
  }

  function completeTour() {
    // Track completion
    trackEvent('complete');
    
    markTourCompleted();
    removeTourElements();
    state.isActive = false;
    state.config.onComplete();
  }

  function removeTourElements() {
    if (state.elements.overlay) state.elements.overlay.remove();
    if (state.elements.tooltip) state.elements.tooltip.remove();
    if (state.elements.spotlight) state.elements.spotlight.remove();
    state.elements = {};
  }

  function hasCompletedTour(tourId) {
    try {
      const completed = localStorage.getItem(state.config.storageKey);
      return completed && completed.includes(tourId);
    } catch (e) {
      return false;
    }
  }

  function markTourCompleted() {
    try {
      const tourId = state.tourData?.id;
      if (tourId) {
        const completed = localStorage.getItem(state.config.storageKey) || '';
        const tours = completed ? completed.split(',') : [];
        
        if (!tours.includes(tourId)) {
          tours.push(tourId);
          localStorage.setItem(state.config.storageKey, tours.join(','));
        }
      }
    } catch (e) {
      console.warn('TourFlow: Could not save completion state');
    }
  }

})();
