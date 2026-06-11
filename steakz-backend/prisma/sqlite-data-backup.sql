PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "branch" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO User VALUES(116,'Head Office Manager','admin@steakz.com','$2b$10$7gvF.zB7JnX6pQcf41MK3u8ziIxd/1o94GNLqwJHYOMuq8VhnArjm','head_office',NULL,1781122268755);
INSERT INTO User VALUES(117,'Mayfair Prime Chef Two','chef2.mayfair-prime@steakz.com','$2b$10$iJKORs/5wMzdVf9AQAxVN.C8zWVZ9n73XwHcSCbq7MZ97oqIMgMny','chef','Mayfair Prime Steakhouse',1781122270098);
INSERT INTO User VALUES(118,'Kensington Steak Room Chef One','chef1.kensington-steak-room@steakz.com','$2b$10$DTTOnQi8l9bdnknY4jJkounFFZtL0ft7XJ9rXFob/id2I3KWo3utm','chef','Kensington Steak Room',1781122270099);
INSERT INTO User VALUES(119,'Kensington Steak Room Chef Two','chef2.kensington-steak-room@steakz.com','$2b$10$88JKPtCJJtud5R7/8dq6DO5fdvr2PGaDqKqdy6jOLoVlfgf.aDDvG','chef','Kensington Steak Room',1781122270101);
INSERT INTO User VALUES(120,'Kensington Steak Room Waiter One','waiter1.kensington-steak-room@steakz.com','$2b$10$FSOC0EV5who7Jo1Iei63aO8bMh7yDxKY7Z6HmtL1GE7An2gOgBaV2','waiter','Kensington Steak Room',1781122270101);
INSERT INTO User VALUES(121,'Kensington Steak Room Waiter Two','waiter2.kensington-steak-room@steakz.com','$2b$10$dAlJQq2.OGlFCCuo00ePneCPs5IkRJkWjwj4nNpa5m0b6QTgnnulK','waiter','Kensington Steak Room',1781122270101);
INSERT INTO User VALUES(122,'Kensington Customer','customer.kensington-steak-room@example.com','$2b$10$YGd3P9qUgMEXYHN3KJkgWe6Uo8aL2f9gfcHOfp4VrI9srYQMNw0Ny','customer','Kensington Steak Room',1781122270102);
INSERT INTO User VALUES(123,'Canary Wharf Grill House Manager','manager.canary-wharf-grill@steakz.com','$2b$10$Y4P0nWnkyHsWVXIN45j.1OWBtTnkfrRyv0Oc6DDFtBF.VB.qV6Raa','manager','Canary Wharf Grill House',1781122270102);
INSERT INTO User VALUES(124,'Soho Flame Grill Manager','manager.soho-flame@steakz.com','$2b$10$/OvSqxu4kP8YEBeIpdDBIOBaeumtWLG4KQ5mIUdWqYWoRKHFbz6de','manager','Soho Flame Grill',1781122270098);
INSERT INTO User VALUES(125,'Soho Flame Chef One','chef1.soho-flame@steakz.com','$2b$10$2RmnBcEPb3mIYoJQAwETLekg.Q8s8sDmqB3xXWuRn9R6nBgocw5Xy','chef','Soho Flame Grill',1781122270104);
INSERT INTO User VALUES(126,'Soho Flame Chef Two','chef2.soho-flame@steakz.com','$2b$10$FMCdOT4UmVDr.7qQSPD.8eWhuRwFPVPuWBTF9W.vVshYd2Z2lhvhu','chef','Soho Flame Grill',1781122270104);
INSERT INTO User VALUES(127,'Canary Wharf Grill Chef Two','chef2.canary-wharf-grill@steakz.com','$2b$10$Lf3XDNmrwaUoQXwwLbN4I.rfimE1nNl/tZyQbcXonOC1GPV9J0y.y','chef','Canary Wharf Grill House',1781122270105);
INSERT INTO User VALUES(128,'Canary Wharf Grill Waiter One','waiter1.canary-wharf-grill@steakz.com','$2b$10$E55Q99k.x1LvtrumVZelwuMLQkTzYd6pB4lJXig3URvIRYjVHezeK','waiter','Canary Wharf Grill House',1781122270105);
INSERT INTO User VALUES(129,'Canary Wharf Grill Waiter Two','waiter2.canary-wharf-grill@steakz.com','$2b$10$GVs6ybjK.EXwIpDfambBKeR0hZ1fmatFEjVJxsYo91khLvYyttFeW','waiter','Canary Wharf Grill House',1781122270105);
INSERT INTO User VALUES(130,'Canary Customer','customer.canary-wharf-grill@example.com','$2b$10$gBU3fHtPJZr13FJS5x8un.pPLC0JNawSekWcPCzrfAcw90M3A5fvO','customer','Canary Wharf Grill House',1781122270105);
INSERT INTO User VALUES(131,'Soho Flame Waiter One','waiter1.soho-flame@steakz.com','$2b$10$9KEKF/QwqAIw/sMe7Cdp5.wZpg0mAepMK9rubzQtdEwj7.eZLytM.','waiter','Soho Flame Grill',1781122270098);
INSERT INTO User VALUES(132,'Mayfair Prime Steakhouse Manager','manager.mayfair-prime@steakz.com','$2b$10$DNCriRRLwFPGE4eD295ft.h0eu8dzILFMmjRx7j53FPPRKIyE6FGe','manager','Mayfair Prime Steakhouse',1781122270098);
INSERT INTO User VALUES(133,'Kensington Steak Room Manager','manager.kensington-steak-room@steakz.com','$2b$10$A.fwN8.UhLcvrcpaLB9Vy.OaHei669POL3dPq0vV7tAGlWmzL9QPO','manager','Kensington Steak Room',1781122270107);
INSERT INTO User VALUES(134,'Mayfair Customer','customer.mayfair-prime@example.com','$2b$10$TEB4fvuh9UDTh/EhmmH0Quy.SuNjl3kQZQQUG7k9fKMs.5xfGhLCK','customer','Mayfair Prime Steakhouse',1781122270106);
INSERT INTO User VALUES(135,'Soho Flame Waiter Two','waiter2.soho-flame@steakz.com','$2b$10$xroqFtiEp.nAD6TNx3jBJ.H40Nl5vYERbc4Hq5eZU9Fjus15nAoYC','waiter','Soho Flame Grill',1781122270106);
INSERT INTO User VALUES(136,'Mayfair Prime Waiter One','waiter1.mayfair-prime@steakz.com','$2b$10$OBm.pCZxKDFVhrJNIyD2puvETkrIC70roc8/6x5LdIi4gXW2exsya','waiter','Mayfair Prime Steakhouse',1781122270098);
INSERT INTO User VALUES(137,'Soho Customer','customer.soho-flame@example.com','$2b$10$j2vAeGfH1kMbrlZT3kPUP.auJb2qBTqEA.VMB4y.J5X36fC3bAwFW','customer','Soho Flame Grill',1781122270098);
INSERT INTO User VALUES(138,'Mayfair Prime Chef One','chef1.mayfair-prime@steakz.com','$2b$10$RqbEX5c73gEoWWjYvyam5e7OGtEsjZcVyjtHaZTajBpchL6fjZaEC','chef','Mayfair Prime Steakhouse',1781122270098);
INSERT INTO User VALUES(139,'Mayfair Prime Waiter Two','waiter2.mayfair-prime@steakz.com','$2b$10$Bguse9tEZB5pjO7qXRhqtu9RBenuk3phmUHdKOWHCx1ssJtCzJ7YK','waiter','Mayfair Prime Steakhouse',1781122270098);
INSERT INTO User VALUES(140,'Canary Wharf Grill Chef One','chef1.canary-wharf-grill@steakz.com','$2b$10$8Ps34.qFyYkNjxLEPLcT2OyPJci0VR6qPttdrpE3hsJMHgePIztZ.','chef','Canary Wharf Grill House',1781122270104);
CREATE TABLE IF NOT EXISTS "MenuItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO MenuItem VALUES(35,'Dry-Aged Ribeye Steak','Signature Steaks',34.95000000000000285,1,1781122270114);
INSERT INTO MenuItem VALUES(36,'Prime Fillet Mignon','Signature Steaks',39.5,1,1781122270114);
INSERT INTO MenuItem VALUES(37,'Chargrilled Sirloin','Grill',29.75,1,1781122270115);
INSERT INTO MenuItem VALUES(38,'Steakz House Burger','Burgers',16.94999999999999929,1,1781122270115);
INSERT INTO MenuItem VALUES(39,'Garlic Butter Prawns','Starters',13.5,1,1781122270115);
INSERT INTO MenuItem VALUES(40,'New York Cheesecake','Desserts',8.75,1,1781122270116);
CREATE TABLE IF NOT EXISTS "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customer" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "total" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "Order" VALUES(11,'Walk-in Customer','Mayfair Prime Steakhouse','Completed',57.20000000000000284,1781122270116,136);
INSERT INTO "Order" VALUES(12,'Online Order','Soho Flame Grill','Completed',69.25,1781122270117,132);
CREATE TABLE IF NOT EXISTS "OrderItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderId" INTEGER NOT NULL,
    "menuItemId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO OrderItem VALUES(25,11,35,1,34.95000000000000285);
INSERT INTO OrderItem VALUES(26,11,39,1,13.5);
INSERT INTO OrderItem VALUES(27,11,40,1,8.75);
INSERT INTO OrderItem VALUES(28,12,36,1,39.5);
INSERT INTO OrderItem VALUES(29,12,37,1,29.75);
CREATE TABLE IF NOT EXISTS "Inventory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "itemName" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "reorderLevel" INTEGER NOT NULL,
    "supplier" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO Inventory VALUES(21,'Dry-Aged Ribeye Cuts','Mayfair Prime Steakhouse',24,10,'London Prime Butchers',1781122270116);
INSERT INTO Inventory VALUES(22,'Fillet Mignon Cuts','Soho Flame Grill',18,8,'Premium Beef Supply',1781122270116);
INSERT INTO Inventory VALUES(23,'Sirloin Cuts','Kensington Steak Room',22,9,'Heritage Meat Co.',1781122270116);
INSERT INTO Inventory VALUES(24,'Brioche Burger Buns','Canary Wharf Grill House',48,18,'City Bakery Supply',1781122270116);
CREATE TABLE IF NOT EXISTS "Reservation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customer" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "guests" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Requested',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO Reservation VALUES(4,'Mayfair Customer','customer.mayfair-prime@example.com','07123 456789','Mayfair Prime Steakhouse',4,'2026-06-20','19:30','Confirmed',1781122270118,134);
INSERT INTO sqlite_sequence VALUES('User',140);
INSERT INTO sqlite_sequence VALUES('MenuItem',40);
INSERT INTO sqlite_sequence VALUES('Inventory',24);
INSERT INTO sqlite_sequence VALUES('Order',12);
INSERT INTO sqlite_sequence VALUES('OrderItem',29);
INSERT INTO sqlite_sequence VALUES('Reservation',4);
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
COMMIT;
