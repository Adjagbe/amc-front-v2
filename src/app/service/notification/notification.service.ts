import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  /**
   * Affiche une notification de succès
   * @param message Message à afficher
   */
  showSuccess(message: string) {
    this.createToast(message, 'success');
  }

  /**
   * Affiche une notification d'erreur
   * @param message Message à afficher
   */
  showError(message: string) {
    this.createToast(message, 'error');
  }

  /**
   * Affiche une notification d'information
   * @param message Message à afficher
   */
  showInfo(message: string) {
    this.createToast(message, 'info');
  }

  /**
   * Confirmation de suppression avec modal personnalisé
   * @param message Message de confirmation
   * @param title Titre du modal (optionnel)
   * @returns Promise<boolean> true si confirmé
   */
  confirmDelete(message: string, title: string = 'Confirmer la suppression'): Promise<boolean> {
    return new Promise((resolve) => {
      this.createConfirmModal(message, title, resolve);
    });
  }

  /**
   * Crée un toast notification
   * @param message Message à afficher
   * @param type Type de notification
   */
  private createToast(message: string, type: 'success' | 'error' | 'info') {
    // Créer l'élément toast
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out translate-x-full`;
    
    // Définir les couleurs selon le type
    const colors = {
      success: 'bg-green-500 text-white',
      error: 'bg-red-500 text-white',
      info: 'bg-blue-500 text-white'
    };
    
    toast.className += ` ${colors[type]}`;
    toast.innerHTML = `
      <div class="flex items-center">
        <span class="mr-3">${this.getIcon(type)}</span>
        <span class="font-medium">${message}</span>
        <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
          ×
        </button>
      </div>
    `;
    
    // Ajouter au DOM
    document.body.appendChild(toast);
    
    // Animation d'entrée
    setTimeout(() => {
      toast.classList.remove('translate-x-full');
    }, 100);
    
    // Suppression automatique après 5 secondes
    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => {
        if (toast.parentElement) {
          toast.remove();
        }
      }, 300);
    }, 5000);
  }

  /**
   * Retourne l'icône correspondant au type
   * @param type Type de notification
   * @returns Icône HTML
   */
  private getIcon(type: 'success' | 'error' | 'info'): string {
    const icons = {
      success: '✓',
      error: '✗',
      info: 'ℹ'
    };
    return icons[type];
  }

  /**
   * Crée un modal de confirmation personnalisé
   * @param message Message de confirmation
   * @param title Titre du modal
   * @param resolve Fonction de résolution de la promesse
   */
  private createConfirmModal(message: string, title: string, resolve: (value: boolean) => void) {
    // Créer l'overlay
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0  z-50 flex items-center justify-center p-4';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    // Créer le modal
    const modal = document.createElement('div');
    modal.className = 'bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all duration-300 ease-in-out scale-95 opacity-0';
    
    modal.innerHTML = `
      <div class="p-6">
        <div class="flex items-center mb-4">
          <div class="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900">${title}</h3>
          </div>
        </div>
        
        <div class="mb-6">
          <p class="text-sm text-gray-500">${message}</p>
        </div>
        
        <div class="flex space-x-3 justify-end">
          <button 
            id="cancelBtn" 
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors">
            Annuler
          </button>
          <button 
            id="confirmBtn" 
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors">
            Supprimer
          </button>
        </div>
      </div>
    `;
    
    // Ajouter le modal à l'overlay
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Animation d'entrée
    setTimeout(() => {
      modal.classList.remove('scale-95', 'opacity-0');
      modal.classList.add('scale-100', 'opacity-100');
    }, 10);
    
    // Fonction pour fermer le modal
    const closeModal = (result: boolean) => {
      modal.classList.add('scale-95', 'opacity-0');
      modal.classList.remove('scale-100', 'opacity-100');
      
      setTimeout(() => {
        if (overlay.parentElement) {
          overlay.remove();
        }
        resolve(result);
      }, 300);
    };
    
    // Événements
    const cancelBtn = modal.querySelector('#cancelBtn');
    const confirmBtn = modal.querySelector('#confirmBtn');
    
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => closeModal(false));
    }
    
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => closeModal(true));
    }
    
    // Fermer avec Escape
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        document.removeEventListener('keydown', handleEscape);
        closeModal(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    // Fermer en cliquant sur l'overlay
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(false);
      }
    });
    
    // Focus sur le bouton annuler par défaut
    setTimeout(() => {
      if (cancelBtn) {
        (cancelBtn as HTMLElement).focus();
      }
    }, 100);
  }
}
