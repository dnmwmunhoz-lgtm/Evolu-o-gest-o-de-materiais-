
import React from 'react';
import { ArgentinaFlagIcon } from '../components/icons/ArgentinaFlagIcon';
import { BrazilFlagIcon } from '../components/icons/BrazilFlagIcon';
import { ChileFlagIcon } from '../components/icons/ChileFlagIcon';
import { ColombiaFlagIcon } from '../components/icons/ColombiaFlagIcon';
import { ParaguayFlagIcon } from '../components/icons/ParaguayFlagIcon';
import { UruguayFlagIcon } from '../components/icons/UruguayFlagIcon';
import { AustraliaFlagIcon } from '../components/icons/AustraliaFlagIcon';
import type { Country } from '../types';

export const countries: Country[] = [
    { code: 'BR', name: 'Brasil', Icon: BrazilFlagIcon },
    { code: 'AR', name: 'Argentina', Icon: ArgentinaFlagIcon },
    { code: 'CL', name: 'Chile', Icon: ChileFlagIcon },
    { code: 'CO', name: 'Colômbia', Icon: ColombiaFlagIcon },
    { code: 'PY', name: 'Paraguai', Icon: ParaguayFlagIcon },
    { code: 'UY', name: 'Uruguai', Icon: UruguayFlagIcon },
    { code: 'AU', name: 'Austrália', Icon: AustraliaFlagIcon },
];
