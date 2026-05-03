import ItemComboAppModel from './item-combo-app.model';
import NewPizzaComboAppModel from './new-pizza-combo-app.model';
import PizzaComboAppAdvancedModel from '../advanced/combo/pizza-combo-app-advanced.model';

export default class ComboAppModel {
  public Id: number;
  public Name: string;
  public Description: string;
  public Price: number;
  public ImageUrl: string;
  public ItemCombos: ItemComboAppModel[];
  public NewItemCombos: ItemComboAppModel[];
  public PizzaCombos: PizzaComboAppAdvancedModel[];
  public NewPizzaCombos: NewPizzaComboAppModel[];
}
