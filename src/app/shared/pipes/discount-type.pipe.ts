import { Pipe, PipeTransform } from '@angular/core';
import { DiscountTypeEnum } from "../../enums/discount-type.enum";
import { TranslationsService } from "../translations/translations.service";

@Pipe({ name: 'discountType' })
export class DiscountTypePipe implements PipeTransform {
  constructor(private translationService: TranslationsService) { }
  transform(value, type: DiscountTypeEnum) {
    switch (type) {
      case DiscountTypeEnum.Percent: {
        return value + '%';
      }
      default: {
        return value + this.translationService.translate("COMMON_CASH");
      }
    }
  }
}
