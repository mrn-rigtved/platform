<?php declare(strict_types=1);

namespace Shopware\Core\Checkout\Cart\Price\Struct;

use Shopware\Core\Checkout\Cart\Tax\Struct\CalculatedTaxCollection;
use Shopware\Core\Checkout\Cart\Tax\Struct\TaxRuleCollection;
use Shopware\Core\Framework\Struct\Collection;

class PriceCollection extends Collection
{
    public function get($key): ? CalculatedPrice
    {
        $key = (int) $key;

        if ($this->has($key)) {
            return $this->elements[$key];
        }

        return null;
    }

    public function getTaxRules(): TaxRuleCollection
    {
        $rules = new TaxRuleCollection([]);

        /** @var CalculatedPrice $price */
        foreach ($this->elements as $price) {
            $rules = $rules->merge($price->getTaxRules());
        }

        return $rules;
    }

    public function sum(): CalculatedPrice
    {
        return new CalculatedPrice(
            $this->getUnitPriceAmount(),
            $this->getAmount(),
            $this->getCalculatedTaxes(),
            $this->getTaxRules()
        );
    }

    public function getCalculatedTaxes(): CalculatedTaxCollection
    {
        $taxes = new CalculatedTaxCollection([]);

        /** @var CalculatedPrice $price */
        foreach ($this->elements as $price) {
            $taxes = $taxes->merge($price->getCalculatedTaxes());
        }

        return $taxes;
    }

    public function merge(self $prices): self
    {
        return $this->doMerge($prices);
    }

    protected function getExpectedClass(): ?string
    {
        return CalculatedPrice::class;
    }

    private function getUnitPriceAmount(): float
    {
        $prices = $this->map(function (CalculatedPrice $price) {
            return $price->getUnitPrice();
        });

        return array_sum($prices);
    }

    private function getAmount(): float
    {
        $prices = $this->map(function (CalculatedPrice $price) {
            return $price->getTotalPrice();
        });

        return array_sum($prices);
    }
}
