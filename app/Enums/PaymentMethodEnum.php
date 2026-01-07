<?php

namespace App\Enums;

enum PaymentMethodEnum: string
{
    case PAYNOW = 'paynow';
    case COD    = 'cod';
}
