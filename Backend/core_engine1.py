"""
HELIOS PROTOCOL v1.0 - THE TRUTH ENGINE
========================================
Real-Time Satellite Data Integration for Global Energy Arbitrage

This script connects to Open-Meteo API (German Meteorological Institute)
to fetch LIVE solar radiation data and calculate the energy arbitrage
potential between Bulgaria and USA.

NO API KEY REQUIRED. Just run it.

Usage: python core_engine.py
"""

import requests
import time
import os
from datetime import datetime

try:
    from colorama import Fore, Style, init
    init()
except ImportError:
    # Fallback if colorama not installed
    class Fore:
        CYAN = YELLOW = GREEN = BLUE = RED = MAGENTA = WHITE = ''
    class Style:
        DIM = BRIGHT = RESET_ALL = ''

# CONFIGURATION: THE GLOBAL NODES
NODES = {
    "SOFIA_BG": {
        "lat": 42.6977, 
        "lon": 23.3219, 
        "name": "SOFIA (BULGARIA)",
        "role": "EU GRID NODE"
    },
    "NEW_YORK_US": {
        "lat": 40.7128, 
        "lon": -74.0060, 
        "name": "NEW YORK (USA)",
        "role": "US GRID NODE"
    },
    "TOKYO_JP": {
        "lat": 35.6762,
        "lon": 139.6503,
        "name": "TOKYO (JAPAN)",
        "role": "ASIA GRID NODE"
    }
}

# Market Constants (Simplified for POC)
ENERGY_PRICE_EU = 150  # €/MWh average
ENERGY_PRICE_US = 45   # $/MWh average
TRANSMISSION_COST = 20 # $/MWh estimated HVDC loss
WATER_PER_MWH = 200    # Liters saved per MWh of clean energy


def clear_screen():
    """Cross-platform screen clear"""
    os.system('cls' if os.name == 'nt' else 'clear')


def get_real_data(lat: float, lon: float) -> dict:
    """
    Fetch live weather data from Open-Meteo Satellite API
    Returns: temperature, solar radiation, is_day status
    """
    try:
        url = (
            f"https://api.open-meteo.com/v1/forecast?"
            f"latitude={lat}&longitude={lon}"
            f"&current=temperature_2m,shortwave_radiation,is_day"
            f"&timezone=auto"
        )
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()['current']
        return {
            "temp": data['temperature_2m'],
            "radiation": data['shortwave_radiation'],  # Watt per square meter
            "is_day": data['is_day']
        }
    except Exception as e:
        print(f"[ERROR] API fetch failed: {e}")
        return None


def calculate_arbitrage(node_a: dict, node_b: dict) -> tuple:
    """
    The Core Algorithm: Calculate energy arbitrage potential
    Returns: (direction, megawatts, profit_usd, water_saved_liters)
    """
    direction = "EQUILIBRIUM"
    potential_mw = 0.0
    profit_usd = 0.0
    water_saved = 0.0

    if node_a is None or node_b is None:
        return direction, potential_mw, profit_usd, water_saved

    rad_a = node_a['radiation']
    rad_b = node_b['radiation']

    # Energy flows from HIGH radiation to LOW radiation
    if rad_b > rad_a + 50:  # Threshold to avoid noise
        direction = "US → EU"
        delta = rad_b - rad_a
        potential_mw = delta * 1.5  # Theoretical scaling factor
        profit_usd = potential_mw * (ENERGY_PRICE_EU - ENERGY_PRICE_US - TRANSMISSION_COST)
        water_saved = potential_mw * WATER_PER_MWH

    elif rad_a > rad_b + 50:
        direction = "EU → US"
        delta = rad_a - rad_b
        potential_mw = delta * 1.5
        profit_usd = potential_mw * (ENERGY_PRICE_US * 1.5 - TRANSMISSION_COST)  # Evening premium
        water_saved = potential_mw * WATER_PER_MWH

    return direction, potential_mw, profit_usd, water_saved


def format_status(is_day: bool) -> str:
    """Format day/night status with appropriate emoji"""
    if is_day:
        return f"{Fore.YELLOW}☀️  DAY TIME{Style.RESET_ALL}"
    return f"{Fore.BLUE}🌑 NIGHT TIME{Style.RESET_ALL}"


def print_dashboard(sofia: dict, ny: dict, arb: tuple):
    """
    Print the industrial-grade monitoring dashboard
    """
    clear_screen()
    
    print(f"{Fore.CYAN}╔══════════════════════════════════════════════════════════════════╗")
    print(f"║   {Fore.YELLOW}⚡ HELIOS PROTOCOL v1.0 ⚡{Fore.CYAN}   REAL-TIME SATELLITE DATA           ║")
    print(f"╚══════════════════════════════════════════════════════════════════╝{Style.RESET_ALL}")
    
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    print(f"{Style.DIM}TIMESTAMP: {timestamp} | SOURCE: OPEN-METEO API (SATELLITE){Style.RESET_ALL}\n")

    # SOFIA NODE
    print(f"{Fore.WHITE}┌─────────────────────────────────────────┐")
    print(f"│ 📍 NODE: SOFIA (BULGARIA) - EU GRID     │")
    print(f"├─────────────────────────────────────────┤{Style.RESET_ALL}")
    print(f"│ STATUS:    {format_status(sofia['is_day'])}")
    print(f"│ TEMP:      {Fore.WHITE}{sofia['temp']:>6.1f} °C{Style.RESET_ALL}")
    print(f"│ SOLAR:     {Fore.YELLOW}{sofia['radiation']:>6.1f} W/m²{Style.RESET_ALL}")
    print(f"{Fore.WHITE}└─────────────────────────────────────────┘{Style.RESET_ALL}")
    
    print()

    # NEW YORK NODE
    print(f"{Fore.WHITE}┌─────────────────────────────────────────┐")
    print(f"│ 📍 NODE: NEW YORK (USA) - US GRID       │")
    print(f"├─────────────────────────────────────────┤{Style.RESET_ALL}")
    print(f"│ STATUS:    {format_status(ny['is_day'])}")
    print(f"│ TEMP:      {Fore.WHITE}{ny['temp']:>6.1f} °C{Style.RESET_ALL}")
    print(f"│ SOLAR:     {Fore.YELLOW}{ny['radiation']:>6.1f} W/m²{Style.RESET_ALL}")
    print(f"{Fore.WHITE}└─────────────────────────────────────────┘{Style.RESET_ALL}")

    print()
    print(f"{Fore.MAGENTA}{'═' * 60}")
    print(f"       ⚡ GLOBAL ENERGY ARBITRAGE ENGINE ⚡")
    print(f"{'═' * 60}{Style.RESET_ALL}")

    direction, mw, usd, h2o = arb

    if direction == "EQUILIBRIUM":
        print(f"\n{Fore.RED}>>> STATUS: GRID EQUILIBRIUM - NO ARBITRAGE OPPORTUNITY{Style.RESET_ALL}")
        print(f"    Both nodes have similar solar conditions.")
    else:
        print(f"\n{Fore.GREEN}>>> ARBITRAGE OPPORTUNITY DETECTED!{Style.RESET_ALL}")
        print(f"\n    FLOW DIRECTION:   {Fore.CYAN}{Style.BRIGHT}{direction}{Style.RESET_ALL}")
        print(f"    ENERGY POTENTIAL: {Fore.YELLOW}{mw:,.1f} MW{Style.RESET_ALL}")
        print(f"    EST. PROFIT:      {Fore.GREEN}${usd:,.2f} / hour{Style.RESET_ALL}")
        print(f"    WATER SAVED:      {Fore.BLUE}{h2o:,.0f} Liters (AI Cooling){Style.RESET_ALL}")
        
        # Daily projection
        daily_profit = usd * 24
        yearly_profit = daily_profit * 365
        print(f"\n    {Style.DIM}─── PROJECTIONS ───{Style.RESET_ALL}")
        print(f"    DAILY:  ${daily_profit:,.0f}")
        print(f"    YEARLY: ${yearly_profit:,.0f}")

    print(f"\n{Fore.WHITE}Refreshing every 5 seconds... (Ctrl+C to stop){Style.RESET_ALL}")


def main():
    """Main execution loop"""
    print(f"{Fore.CYAN}HELIOS TRUTH ENGINE INITIALIZING...{Style.RESET_ALL}")
    print("Connecting to satellite data feeds...\n")
    time.sleep(1)

    while True:
        try:
            # Fetch real-time data from both nodes
            data_sofia = get_real_data(
                NODES["SOFIA_BG"]["lat"], 
                NODES["SOFIA_BG"]["lon"]
            )
            data_ny = get_real_data(
                NODES["NEW_YORK_US"]["lat"], 
                NODES["NEW_YORK_US"]["lon"]
            )

            if data_sofia and data_ny:
                arbitrage = calculate_arbitrage(data_sofia, data_ny)
                print_dashboard(data_sofia, data_ny, arbitrage)
            else:
                print("[WARN] Waiting for satellite connection...")

            time.sleep(5)  # Refresh every 5 seconds

        except KeyboardInterrupt:
            print(f"\n{Fore.YELLOW}HELIOS SYSTEM SHUTDOWN.{Style.RESET_ALL}")
            print("Satellite link terminated.")
            break


if __name__ == "__main__":
    main()
