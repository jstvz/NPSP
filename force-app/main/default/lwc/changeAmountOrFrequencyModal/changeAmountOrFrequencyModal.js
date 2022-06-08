import { LightningElement, api } from 'lwc';
import changeAmountOrFrequency from '@salesforce/label/c.changeAmountOrFrequency';
import updateRecurringDonation from '@salesforce/label/c.updateRecurringDonation';
import every from "@salesforce/label/c.RD2_EntryFormScheduleEveryLabel";
import commonAmount from "@salesforce/label/c.commonAmount";
import installmentPeriod from "@salesforce/label/c.installmentPeriod";
import recurringDonationSchedule from "@salesforce/label/c.recurringDonationSchedule";

const ESC_KEY_CODE = 27;
const ESC_KEY_STRING = "Escape";
const FOCUSABLE_ELEMENTS = "button";
const TAB_KEY_CODE = 9;
const TAB_KEY_STRING = "Tab";
export default class ChangeAmountOrFrequencyModal extends LightningElement {
    @api openChangeAmountOrFrequency;
    @api currentRecord;

    labels = {
        changeAmountOrFrequency,
        updateRecurringDonation,
        every,
        commonAmount,
        recurringDonationSchedule,
        installmentPeriod
    }

    renderedCallback() {
        this.template.addEventListener("keydown", (e) => this.handleKeyUp(e));
      }
  
      handleKeyUp(e) {
          const firstFocusableElement = this._getFocusableElements()[0];
          const focusableContent = this._getFocusableElements();
          const lastFocusableElement = focusableContent[focusableContent.length - 1];
        
          if (e.shiftKey) {
            if (this.template.activeElement === firstFocusableElement) {
              lastFocusableElement.focus();
              e.preventDefault();
            }
          } else if(e.code === ESC_KEY_STRING || e.keyCode === ESC_KEY_CODE) {
            this.closeModal();
          } else if(e.code === TAB_KEY_STRING || e.keyCode === TAB_KEY_CODE) {
            if (this.template.activeElement === lastFocusableElement) {
              firstFocusableElement.focus();
              e.preventDefault();
            }
          }
      }   
  
      _getFocusableElements() {
        const potentialElems = [
          ...this.template.querySelectorAll(FOCUSABLE_ELEMENTS),
        ];
        return potentialElems;
      }
  
      closeModal() {
        this.template.removeEventListener("keydown", (e) => this.handleKeyUp(e));
        this.dispatchEvent(new CustomEvent('close', {detail: 'changeAmountOrFrequency'}));
    } 
}