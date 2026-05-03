import { Injectable } from '@angular/core';
import { MenuAppModel } from '../../../models/advanced/menu/menu-app.model';
import ComboAppAdvancedModel from "../../../models/advanced/combo/combo-app-advanced.model";

@Injectable()
export class VersionImageService {

  private currentTime;

  constructor() {
    this.currentTime = new Date().getTime();
  }

  getCurrentVersionOfImages() {
    return '' + this.currentTime;
  }

  updateImageVersion(image) {
    const version = 'vrs=';
    if (image) {
      image = image.replace("http:", "https:");
      if (image.indexOf('?') != -1) {
        image = image + (image.lastIndexOf('&') === (image.length - 1) ? '' : '&') + version + this.getCurrentVersionOfImages();
      } else {
        image = image + '?' + version + this.getCurrentVersionOfImages();
      }
      return image;
    }
    return image;
  }

  updateImageUrlsOfCombo(combos: ComboAppAdvancedModel[]) {
    if (combos) {
      combos.forEach(combo => {
        combo.ImageUrl = this.updateImageVersion(combo.ImageUrl);
        if (combo.ItemCombos) {
          combo.ItemCombos.forEach(item => {
            if (item.Items) {
              item.Items.forEach(i => {
                this.updateItemUrl(i);
              });
            }
          });
        }
        if (combo.PizzaCombos) {
          combo.PizzaCombos.forEach(pizza => {
            if (pizza.Pizza) {
              pizza.Pizza.ImageUrl = this.updateImageVersion(pizza.Pizza.ImageUrl);
            }
          })
        }
      });
    }
  }

  private updateItemUrl(item) {
    if (!item) {
      return;
    }
    item.ImageUrl = this.updateImageVersion(item.ImageUrl);
    item.Garnishes.forEach((garnish) => {
      garnish.ImageUrl = this.updateImageVersion(garnish.ImageUrl);
    });
    item.GarnishGroups.forEach((garnishGroup) => {
      garnishGroup.Garnishes.forEach((grn) => {
        grn.ImageUrl = this.updateImageVersion(grn.ImageUrl);
      })
    })
  }

  updateImageUrlsOfMenu(menu: MenuAppModel) {
    if (!menu) {
      return;
    }
    if (menu.categories) {
      menu.categories = menu.categories.map((category) => {

        category.ImageUrl = this.updateImageVersion(category.ImageUrl);
        category.ImageIFrameUrl = this.updateImageVersion(category.ImageIFrameUrl);
        category.Items.forEach((item) => {
          this.updateItemUrl(item);
        });
        return category;
      });
    }
    if (menu.pizzas) {
      menu.pizzas = menu.pizzas.map((pizza) => {
        pizza.ImageUrl = this.updateImageVersion(pizza.ImageUrl);
        return pizza;
      });
    }
    if (menu.pizzaToppings) {
      menu.pizzaToppings = menu.pizzaToppings.map((pizza) => {
        pizza.ImageUrl = this.updateImageVersion(pizza.ImageUrl);
        pizza.QuarterPizzaImageUrl = this.updateImageVersion(pizza.QuarterPizzaImageUrl);
        return pizza;
      });
    }
  }



}
