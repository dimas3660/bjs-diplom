"use strict"

const logoutButton = new LogoutButton();

logoutButton.action = () =>
    ApiConnector.logout(response => {
        if (response.success) {
            location.reload();
        }
    });

ApiConnector.current((response) => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

const ratesBoard = new RatesBoard();
function updateRates() {
    ApiConnector.getStocks((response) => {
        if (response.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        }
    });
}
setTimeout(updateRates);
setInterval(updateRates, 60000);

const moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = data => {
    ApiConnector.addMoney(data, response => {
        if (!response.success) {
            moneyManager.setMessage(response.success, response.error + " Средства добавлены не были!");
        } else {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.success, `Сумма добавлена!`);
        }
    });
}

moneyManager.conversionMoneyCallback = data => {
    ApiConnector.convertMoney(data, response => {
        if (!response.success) {
            moneyManager.setMessage(response.success, response.error + " Конвертация не проведена!");
        } else {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.success, `Конвертация успешно проведена!`);
        }
    });
}

moneyManager.sendMoneyCallback = data => {
    ApiConnector.transferMoney(data, response => {
        if (!response.success) {
            moneyManager.setMessage(response.success, response.error + " Сумма не переведена!");
        } else {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage(response.success, `Сумма успешно переведена!`);
        }
    });
}

const favoritesWidget = new FavoritesWidget();
function updateFavorites(data) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(data);
    moneyManager.updateUsersList(data);
}

ApiConnector.getFavorites(response => {
    if (response.success) {
        updateFavorites(response.data);
    }
});

favoritesWidget.addUserCallback = data => {
    ApiConnector.addUserToFavorites(data, response => {
        if (response.success) {
            updateFavorites(response.data);
            favoritesWidget.setMessage(response.success, `Пользователь добавлен!`);
            return;
        } else {
            favoritesWidget.setMessage(response.success, `Пользователь не добавлен!`);
            return;
        }
    });
}

favoritesWidget.removeUserCallback = data => {
    ApiConnector.removeUserFromFavorites(data, response => {
        if (response.success) {
            updateFavorites(response.data);
            favoritesWidget.setMessage(response.success, `Пользователь удален!`);
            return;
        } else {
            favoritesWidget.setMessage(response.success, `Пользователь не удален!`);
            return;
        }
    });
}
