# Acerca del proyecto

## Requerimientos
1. Requiero la web para realizar venta de libros en formato pdf. 
2. Espacio para alojar cursos virtuales grabados.
3. Dar la posibilidad a los clientes de comprar con tarjetas de crédito y aplicativos de pago.
4. Posibilidad de que el cliente se suscriba por trimestre, semestre y anual. 
5. Que la compra del producto se envíe automáticamente al correo del comprador.
6. Que la página esté vinculada a WhatsApp. 
7. Que sea una página amigable e intuitiva. 
8. Que sea una web que llame la atención.

Comandos a ejecutar

Ejecutar las migraciones y los seeders
```bash
php artisan migrate:fresh --seed
```

> Nota. Importante siempre ejecutar `git pull origin master` esto antes de crearse una nueva rama

Para crear una rama
```bash
git branch nombre-rama
git switch nombre-rama
```

Para pushear una rama
```bash
git push -u origin nombre-rama
```

Convenientemente usar feat/nombre-rama



| Campo | Valor |
|-------|-------|
| **Número** | `4075 5957 1648 3764` |
| **Vencimiento** | `11/30` |
| **CVV** | `123` |
| **Nombre titular** | `APRO APRO` |
| **Tipo documento** | `DNI` |
| **Número DNI** | `12345678` |