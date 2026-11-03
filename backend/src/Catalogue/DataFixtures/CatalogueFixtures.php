<?php

namespace App\Catalogue\DataFixtures;

use App\Catalogue\Entity\Category;
use App\Catalogue\Entity\Product;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

/**
 * Jeu de données local : composants pour la robotique.
 * Montants en centimes. Le produit "SERVO-SG90-5" est en rupture pour tester le refus d'ajout au panier.
 */
class CatalogueFixtures extends Fixture
{
    private const CATEGORIES = [
        'microcontroleurs' => 'Microcontrôleurs',
        'capteurs' => 'Capteurs',
        'kits-robotiques' => 'Kits robotiques',
        'moteurs-servos' => 'Moteurs et servos',
        'outillage-alimentation' => 'Outillage et alimentation',
    ];

    /** [sku, slug, name, description, priceCents, compareAtPriceCents, stock, category, specs] */
    private const PRODUCTS = [
        ['MCU-UNO-R4W', 'arduino-uno-r4-wifi', 'Carte Arduino Uno R4 WiFi', 'Carte Arduino Uno R4 avec WiFi et Bluetooth intégrés, idéale pour débuter et prototyper.', 2490, 2990, 42, 'microcontroleurs', ['Tension' => '5 V', 'Processeur' => 'Renesas RA4M1', 'Connectivité' => 'WiFi, Bluetooth']],
        ['MCU-ESP32-DK', 'esp32-devkit-wifi-bluetooth', 'ESP32 DevKit WiFi et Bluetooth', 'Module ESP32 double coeur avec WiFi et Bluetooth, pour vos projets connectés.', 990, null, 120, 'microcontroleurs', ['Tension' => '3,3 V', 'Processeur' => 'Xtensa LX6 240 MHz', 'Connectivité' => 'WiFi, Bluetooth']],
        ['MCU-PICO-H', 'raspberry-pi-pico-h', 'Raspberry Pi Pico H', 'Microcontrôleur RP2040 avec connecteurs soudés, programmable en MicroPython ou C/C++.', 650, null, 85, 'microcontroleurs', ['Tension' => '3,3 V', 'Processeur' => 'RP2040 133 MHz']],
        ['MCU-NANO-V3', 'arduino-nano-v3-compatible', 'Carte compatible Arduino Nano V3', 'Format compact pour les montages sur breadboard et les robots de petite taille.', 790, 990, 60, 'microcontroleurs', ['Tension' => '5 V', 'Processeur' => 'ATmega328P']],
        ['MCU-STM32-BP', 'stm32-blue-pill', 'Carte STM32 Blue Pill', 'Carte STM32F103 économique pour les projets demandant plus de puissance qu\'un Arduino.', 890, null, 33, 'microcontroleurs', ['Tension' => '3,3 V', 'Processeur' => 'STM32F103C8 72 MHz']],

        ['SEN-HCSR04-10', 'lot-10-capteurs-ultrason-hc-sr04', 'Lot de 10 capteurs ultrason HC-SR04', 'Capteurs de distance à ultrasons, portée de 2 cm à 4 m.', 1250, 1800, 75, 'capteurs', ['Tension' => '5 V', 'Portée' => '2 cm à 4 m']],
        ['SEN-IR-LINE', 'capteur-suiveur-de-ligne-infrarouge', 'Capteur suiveur de ligne infrarouge', 'Module à 5 capteurs infrarouges pour robot suiveur de ligne.', 690, null, 54, 'capteurs', ['Tension' => '3,3 à 5 V', 'Canaux' => '5']],
        ['SEN-DHT22', 'capteur-temperature-humidite-dht22', 'Capteur de température et d\'humidité DHT22', 'Capteur numérique précis pour mesurer la température et l\'humidité ambiantes.', 590, null, 90, 'capteurs', ['Tension' => '3,3 à 5 V', 'Protocole' => '1-Wire', 'Précision' => '±0,5 °C']],
        ['SEN-MPU6050', 'module-gyroscope-accelerometre-mpu6050', 'Module gyroscope et accéléromètre MPU6050', 'Centrale inertielle 6 axes pour l\'équilibrage et la détection de mouvement.', 450, null, 48, 'capteurs', ['Tension' => '3,3 V', 'Protocole' => 'I2C', 'Axes' => '6']],
        ['SEN-PIR-HC501', 'capteur-mouvement-pir-hc-sr501', 'Capteur de mouvement PIR HC-SR501', 'Détecteur de présence infrarouge à sensibilité réglable.', 320, null, 70, 'capteurs', ['Tension' => '5 V', 'Portée' => '3 à 7 m']],

        ['KIT-ROBOT-4W', 'kit-robot-4-roues-a-monter', 'Kit robot 4 roues à monter, châssis et moteurs', 'Kit complet avec châssis, 4 moteurs, roues et support de batterie. Guide de montage pas à pas.', 3990, 5990, 18, 'kits-robotiques', ['Roues' => '4', 'Alimentation' => '4 piles AA', 'Niveau' => 'Débutant']],
        ['KIT-ELEC-300', 'kit-demarrage-electronique-300-composants', 'Kit de démarrage électronique, 300 composants', 'Breadboard, LED, résistances, boutons et câbles pour apprendre l\'électronique.', 2990, null, 40, 'kits-robotiques', ['Composants' => '300', 'Niveau' => 'Débutant']],
        ['KIT-ARM-6DOF', 'kit-bras-robotique-6-axes', 'Kit bras robotique 6 axes', 'Bras articulé en aluminium avec 6 servomoteurs, à piloter depuis Arduino.', 6990, 8990, 9, 'kits-robotiques', ['Axes' => '6', 'Charge max' => '200 g', 'Niveau' => 'Intermédiaire']],
        ['KIT-TANK-TRK', 'kit-robot-chenille', 'Kit robot à chenilles', 'Châssis à chenilles pour terrains irréguliers, deux moteurs inclus.', 4590, null, 14, 'kits-robotiques', ['Motorisation' => '2 moteurs DC', 'Niveau' => 'Intermédiaire']],

        ['SERVO-SG90-5', 'lot-5-micro-servos-sg90', 'Lot de 5 micro-servos SG90', 'Micro-servomoteurs 9 g, couple de 1,8 kg/cm, pour bras et directions de robots.', 1190, null, 0, 'moteurs-servos', ['Tension' => '4,8 à 6 V', 'Couple' => '1,8 kg/cm']],
        ['SERVO-MG996R', 'servomoteur-mg996r', 'Servomoteur MG996R à engrenages métal', 'Servo à fort couple pour charges plus lourdes.', 890, 1090, 36, 'moteurs-servos', ['Tension' => '4,8 à 7,2 V', 'Couple' => '11 kg/cm']],
        ['MOT-DC-TT-4', 'lot-4-moteurs-dc-avec-reducteur', 'Lot de 4 moteurs DC avec réducteur et roues', 'Motoréducteurs jaunes 1:48 avec roues, standards pour les petits robots.', 990, null, 52, 'moteurs-servos', ['Tension' => '3 à 6 V', 'Réduction' => '1:48']],
        ['MOT-L298N', 'pilote-moteur-l298n', 'Pilote de moteur L298N double pont en H', 'Contrôle deux moteurs DC ou un moteur pas à pas.', 540, null, 65, 'moteurs-servos', ['Courant max' => '2 A par canal', 'Tension' => '5 à 35 V']],
        ['MOT-NEMA17', 'moteur-pas-a-pas-nema-17', 'Moteur pas à pas NEMA 17', 'Moteur pas à pas 200 pas/tour, utilisé en imprimante 3D et en robotique.', 1490, null, 27, 'moteurs-servos', ['Pas' => '1,8°', 'Courant' => '1,7 A']],

        ['OUT-ALIM-30V', 'alimentation-laboratoire-reglable-30v', 'Alimentation de laboratoire réglable 30 V', 'Alimentation stabilisée 0-30 V / 0-5 A avec affichage numérique.', 4990, 6990, 11, 'outillage-alimentation', ['Tension' => '0 à 30 V', 'Courant' => '0 à 5 A']],
        ['OUT-SOUD-TEMP', 'fer-a-souder-temperature-reglable', 'Fer à souder à température réglable', 'Fer à souder 60 W avec réglage de 200 à 450 °C.', 2790, 3690, 31, 'outillage-alimentation', ['Puissance' => '60 W', 'Température' => '200 à 450 °C']],
        ['OUT-MULTI-AUTO', 'multimetre-numerique-auto-range', 'Multimètre numérique auto-range', 'Mesure de tension, courant, résistance et continuité avec sélection automatique de calibre.', 1990, null, 44, 'outillage-alimentation', ['Affichage' => '6000 points', 'Mesures' => 'V, A, Ω, continuité']],
        ['OUT-RES-ASSORT', 'assortiment-resistances-condensateurs', 'Assortiment de résistances et condensateurs', 'Boîte de rangement avec résistances et condensateurs de valeurs courantes.', 1490, null, 58, 'outillage-alimentation', ['Contenu' => 'Résistances et condensateurs']],
    ];

    public function load(ObjectManager $manager): void
    {
        $categories = [];
        foreach (self::CATEGORIES as $slug => $name) {
            $categories[$slug] = new Category($name, $slug);
            $manager->persist($categories[$slug]);
        }

        foreach (self::PRODUCTS as [$sku, $slug, $name, $description, $price, $comparePrice, $stock, $category, $specs]) {
            $manager->persist(new Product(
                sku: $sku,
                slug: $slug,
                name: $name,
                description: $description,
                priceCents: $price,
                category: $categories[$category],
                stock: $stock,
                compareAtPriceCents: $comparePrice,
                specs: $specs,
            ));
        }

        $manager->flush();
    }
}
