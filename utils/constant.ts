
import { FaTelegramPlane } from "react-icons/fa";
import { FaGithub } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { SiGmail } from "react-icons/si";
import { FaGlobe } from "react-icons/fa6";

export const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
export const USDC_DECIMALS = 6;

export const socialHandles = [
    {
        icon: FaTelegramPlane,
        key: 'telegram',
        href: 'https://t.me/defilenscommunity',
    },
    {
        icon: FaXTwitter,
        key: 'twitter',
        href: 'https://twitter.com/DefiLensTech',
    },
    {
        icon: SiGmail,
        key: 'email',
        href: 'mailto:contact@defilens.com',
    },
    {
        icon: FaGithub,
        key: 'github',
        href: 'https://github.com/sunnyRK',
    },
    {
        icon: FaGlobe,
        key: 'web',
        href: 'https://defilens.tech/',
    }
];

export const meta = {
    title: "Buy New Memecoins Instantly | Batch Trading | Base & Solana | Zero Gas",
    description:
        "Effortlessly manage your memecoin portfolio with DefiLens Memecoin Rebalancer. Batch buy across chains, enjoy gasless trading, automate trades with set conditions, and stay updated on the latest trends - all without fees.",
    keywords:
        "defi, base, acccount abstraction, smart account, trading, batching, rebalance, Memecoin, Portfolio management, Gasless trading, Automated trades, Batch buying, Crypto trends, DefiLens, Multi-chain support, Trading without fees, Market updates",
    url: "https://base.snapbam.fun/",
    image: "https://base.snapbam.fun/",
    app: "https://base.snapbam.fun/home_screenshot.png",
    SITE_NAME: "snapbam.fun",
    APP_NAME: "Snapbam",
    username: "@Snapbam",
    email: "contact@snapbam.fun",
};

import meme_coin_details from './meme_coin_details.json';

interface IMemeCoinData {
    id: string;
    name: string,
    symbol: string,
    asset_platform_id: string,
    detail_platforms: {
        base: {
            decimal_place: number;
            contract_address: string;
        };
    },
    image: {
        thumb: string;
        small: string;
        large: string;
    }
    error: string | null;
}

export const memeCoinData: IMemeCoinData[] = meme_coin_details as IMemeCoinData[];