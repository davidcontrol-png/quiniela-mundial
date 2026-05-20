#!/usr/bin/env python3
# ============================================================
#  seed_users.py
#  Script para crear todos los usuarios de Ogilvy en Firebase
#  Ejecutar UNA sola vez desde tu PC con:
#    pip install firebase-admin --break-system-packages
#    python seed_users.py
#
#  ANTES: descarga tu serviceAccountKey.json desde
#  Firebase Console > Configuracion del proyecto > Cuentas de servicio
# ============================================================

import firebase_admin
from firebase_admin import credentials, auth, firestore

# ── Inicializar Firebase Admin ─────────────────────────────
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db   = firestore.client()

# ── Configuraci\u00f3n admin ──────────────────────────────────
ADMIN_USERNAME = "carlos.romero"
ADMIN_PASSWORD = "Mundial2026!"
ADMIN_EMAIL    = "carlitox337@gmail.com"
DEFAULT_PASS   = "Mundial2026!"   # Contrase\u00f1a inicial para todos

# ── Lista de empleados ────────────────────────────────────
EMPLOYEES = [
    "Pamela Abarca",
    "Yanira Acosta de Mart\u00ednez",
    "Erika Alem\u00e1n",
    "Carlos Alfaro Rivas",
    "M\u00e1ximo Alvarado Portillo",
    "Aby Argueta Zalda\u00f1a",
    "Melida Ayala Paname\u00f1o",
    "Mario Benavides Solano",
    "Bruno Bianchi",
    "Paolo Bianchi",
    "Enzo Bianchi Choussy",
    "Jaime Carranza Molina",
    "Guille Carrero de Eguizabal",
    "Tony Pastore",
    "C\u00e9sar Ch\u00e1vez Cardenas",
    "Roxana Contreras L\u00f3pez",
    "Edwin Cortez",
    "Caro D\u00edaz R\u00edos",
    "Mariu Engelhard Herrera",
    "Letty Flores Cruz",
    "Claudia Flores Valle",
    "Gaby Garcia Rivas",
    "Karen G\u00f3chez De Pa\u00fal",
    "Mario Granados",
    "Rebeca Granados",
    "Cori Guill\u00e9n Manzanares",
    "Josu\u00e9 Hern\u00e1ndez",
    "Rosy Hern\u00e1ndez de Guandique",
    "Marco Hern\u00e1ndez Rivas",
    "Karla Herrera Carranza",
    "Juan Leonor L\u00f3pez",
    "Julio Lopez",
    "Mario L\u00f3pez Cerritos",
    "Rodrigo L\u00f3pez Cestoni",
    "Gabriela Mart\u00ednez",
    "Alex Mart\u00ednez Gonz\u00e1lez",
    "Walter Matute Guzm\u00e1n",
    "Mel Mena",
    "Josue M\u00e9ndez",
    "Tere Mor\u00e1n Escobar",
    "Jes\u00fas Nolasco Ort\u00edz",
    "Rafa Pacas Leiva",
    "Oscar Perez",
    "Ariel P\u00e9rez Coreas",
    "Rodrigo Ramos",
    "Karen Rivas Navarro",
    "Ena Rivas Ram\u00edrez",
    "Miguel Rivera Lara",
    "Mario Rivera Merino",
    "Delmy Rodr\u00edguez Gonz\u00e1lez",
    "Marcella Rodr\u00edguez Moreno",
    "Carlos Romero Lainez",           # <-- t\u00fa (ser\u00e1 admin)
    "Ezequiel Romero Orellana",
    "Francia Salazar Ascencio",
    "Ivania Samayoa Gir\u00f3n",
    "Miriam S\u00e1nchez de Castro",
    "Javier Sandoval Figueroa",
    "Manuel Segovia",
    "Amilcar Serrano Mej\u00eda",
    "Anto Soriano Villatoro",
    "Muriel Tobar Hern\u00e1ndez",
    "Fabiola Trabanino Herrera",
    "Emely Urbina",
    "Roxana Ur\u00edas de Golcher",
    "Sebasti\u00e1n Valencia Guzm\u00e1n",
    "Tania Vanegas",
    "Chiki Vasquez",
    "David Vela",
    "Jamin Ventura Rivera",
    "Ra\u00fal Villatoro L\u00f3pez",
    "Olga Zelaya Mart\u00ednez",
]

def name_to_username(full_name: str) -> str:
    """Convierte 'Pamela Abarca' -> 'pamela.abarca'"""
    import unicodedata
    # Normalizar: quitar acentos
    nfkd = unicodedata.normalize('NFKD', full_name)
    ascii_str = "".join(c for c in nfkd if not unicodedata.combining(c))
    parts = ascii_str.strip().lower().split()
    if len(parts) >= 2:
        return f"{parts[0]}.{parts[1]}"
    return parts[0]

def name_to_email(full_name: str, username: str) -> str:
    """Genera email ficticio @ogilvy.sv"""
    return f"{username}@ogilvy.sv"

# ── Crear usuarios ────────────────────────────────────────
created = 0
skipped = 0

for full_name in EMPLOYEES:
    username = name_to_username(full_name)
    email    = name_to_email(full_name, username)
    is_admin = (full_name == "Carlos Romero Lainez")
    password = ADMIN_PASSWORD if is_admin else DEFAULT_PASS

    # Si es el admin, usar su email real
    if is_admin:
        email    = ADMIN_EMAIL
        username = ADMIN_USERNAME

    try:
        # Crear en Firebase Authentication
        user_record = auth.create_user(
            email=email,
            password=password,
            display_name=full_name,
            disabled=False
        )

        # Crear en Firestore
        db.collection("users").document(user_record.uid).set({
            "displayName":        full_name,
            "username":           username,
            "email":              email,
            "isAdmin":            is_admin,
            "disabled":           False,
            "totalPoints":        0,
            "exactPredictions":   0,
            "resultPredictions":  0,
        })

        role = " [ADMIN]" if is_admin else ""
        print(f"  \u2713 {full_name} -> {username} / {email}{role}")
        created += 1

    except auth.EmailAlreadyExistsError:
        print(f"  \u26A0\uFE0F  {email} ya existe, omitido.")
        skipped += 1
    except Exception as e:
        print(f"  \u2717  Error con {full_name}: {e}")

print(f"\n{'='*50}")
print(f"Creados: {created} | Omitidos: {skipped}")
print(f"{'='*50}")
print("\nListo! Ahora puedes ingresar con:")
print(f"  Usuario:     {ADMIN_USERNAME}")
print(f"  Contrase\u00f1a:  {ADMIN_PASSWORD}")
print(f"  URL Admin:   https://TU-USUARIO.github.io/quiniela-mundial/admin/")
