import type { IStaticMethods } from "flyonui/flyonui";
import { HSAccordion } from "flyonui/flyonui";
import { HSDropdown } from "flyonui/flyonui";
import type * as jQueryType from "jquery";

// declare global {
//     interface Window {
//         // FlyonUI Components
//         HSAccordion: typeof HSAccordion;
//         HSStaticMethods: IStaticMethods;

//         // Third-party
//         _: any;
//         $: typeof jQueryType;
//         jQuery: typeof jQueryType;
//         DataTable: any;
//         Dropzone: any;
//     }
// }

declare global {
    interface Window {
      // Optional third-party libraries
      _;
      $: typeof import("jquery");
      jQuery: typeof import("jquery");
      DataTable;
      Dropzone;
      dropdown;
  
      // FlyonUI
      HSStaticMethods: IStaticMethods;
      HSDropdown : typeof HSDropdown;
      HSAccordion: typeof HSAccordion;
    }
  }

export { };
