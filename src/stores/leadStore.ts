import { defineStore } from 'pinia';

export const useLeadStore = defineStore('lead', {
  state: () => ({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    zipCode: '',
    companyName: '',
    hasCompany: false,
    selectedCountryCode: 'US' // Store code to sync dial code
  }),
  actions: {
    updateField(field: string, value: any) {
      (this as any)[field] = value;
      this.saveToStorage();
    },
    saveToStorage() {
      const data = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phone: this.phone,
        birthDate: this.birthDate,
        zipCode: this.zipCode,
        companyName: this.companyName,
        hasCompany: this.hasCompany,
        selectedCountryCode: this.selectedCountryCode
      };
      localStorage.setItem('dicas_lead_draft', JSON.stringify(data));
    },
    loadFromStorage() {
      const saved = localStorage.getItem('dicas_lead_draft');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          Object.assign(this, data);
        } catch (e) {
          console.error('Failed to parse lead draft', e);
        }
      }
    },
    clear() {
      this.$reset();
      localStorage.removeItem('dicas_lead_draft');
    }
  }
});
