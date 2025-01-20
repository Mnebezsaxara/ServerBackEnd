    // Изначально скрываем элементы управления, таблицу и пагинацию
    document.getElementById("controls").style.display = "none";
    document.getElementById("bookings-list").style.display = "none";
    document.getElementById("pagination").style.display = "none";

    // Функция для получения токена из localStorage
    function getToken() {
        return localStorage.getItem('token');
    }

    // Проверка авторизации перед выполнением действий
    function isAuthenticated() {
        return !!getToken();
    }

    // Создание бронирования
    document.getElementById("booking-form").addEventListener("submit", async (event) => {
        event.preventDefault();

        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;
        const field = document.getElementById("field").value;
        console.log('Отправляем токен:', getToken());


        if (!isAuthenticated()) {
            alert("Вы должны авторизоваться, чтобы управлять бронированием.");
            return;
        }


        try {
            const response = await fetch("http://localhost:8080/booking", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}`
                },
                body: JSON.stringify({ date, time, field }),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Бронирование успешно создано");

                // Очищаем форму
                document.getElementById("booking-form").reset();

                // Скрываем кнопки сортировки, фильтрации и пагинацию, чтобы они не отображались
                document.getElementById("controls").style.display = "none";
                document.getElementById("pagination").style.display = "none";
                document.getElementById("bookings-list").style.display = "none";

            } else {
                alert(`Ошибка: ${data.error || "Не удалось создать бронирование"}`);
            }
        } catch (error) {
            console.error("Ошибка при создании бронирования:", error);
            alert("Ошибка при создании бронирования.");
        }
    });

    // Получение бронирований с параметрами (сортировка, фильтрация, пагинация)
    async function fetchBookings(page = 1, sort = "", filter = "") {
        const url = new URL("http://localhost:8080/booking");
        url.searchParams.append("page", page);
        if (sort) url.searchParams.append("sort", sort);
        if (filter) url.searchParams.append("filter", filter);

        if (!isAuthenticated()) {
            alert("Вы должны авторизоваться, чтобы управлять бронированием.");
            return;
        }

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${getToken()}`
                    },
                });
            const bookings = await response.json();

            if (response.ok) {
                renderBookingsTable(bookings.data); // Отобразить таблицу с бронированиями
                renderPagination(bookings.totalPages, page, sort, filter); // Отобразить пагинацию
            } else {
                alert("Ошибка при получении бронирований.");
            }
        } catch (error) {
            console.error("Ошибка при получении бронирований:", error);
            alert("Ошибка при загрузке бронирований.");
        }
    }

    // Отображение бронирований в виде таблицы
    function renderBookingsTable(bookings) {
        if (!Array.isArray(bookings) || bookings.length === 0) {
            document.getElementById("bookings-list").innerHTML = "<p>Нет данных для отображения.</p>";
            return;
        }

        const table = `
            <table>
                <thead>
                    <tr>
                        <th>Дата</th>
                        <th>Время</th>
                        <th>Поле</th>
                    </tr>
                </thead>
                <tbody>
                    ${bookings
                        .map(
                            (booking) => `
                        <tr>
                            <td>${booking.date}</td>
                            <td>${booking.time}</td>
                            <td>${booking.field}</td>
                        </tr>
                    `
                        )
                        .join("")}
                </tbody>
            </table>
        `;

        document.getElementById("bookings-list").innerHTML = table;

        // Показываем кнопки сортировки и пагинацию только при просмотре бронирований
        document.getElementById("controls").style.display = "block";
        document.getElementById("pagination").style.display = "block";
    }

    // Кнопка "Посмотреть бронирования"
    document.getElementById("view-bookings").addEventListener("click", () => {
        document.getElementById("bookings-list").style.display = "block";
        document.getElementById("controls").style.display = "block";
        document.getElementById("pagination").style.display = "block";
        console.log('Отправляем токен:', getToken());
        fetchBookings();
    });

    // Кнопка "Обновить бронирование"
    document.getElementById("update-booking").addEventListener("click", async () => {
        const id = prompt("Введите ID бронирования для обновления:");
        const date = prompt("Введите новую дату (YYYY-MM-DD):");
        const time = prompt("Введите новое время (HH:MM):");
        const field = prompt("Введите новое поле (Поле Бекет Батыра / Поле Орынбаева):");
        console.log('Отправляем токен:', getToken());

        

        if (id && date && time && field) {
            if (!isAuthenticated()) {
                alert("Вы должны авторизоваться, чтобы управлять бронированием.");
                return;
            }
            try {
                const response = await fetch(`http://localhost:8080/booking/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${getToken()}`
                    },
                    body: JSON.stringify({ date, time, field }),
                });

                const data = await response.json();
                if (response.ok) {
                    alert("Бронирование успешно обновлено");
                    fetchBookings(); // Обновляем список бронирований
                } else {
                    alert(`Ошибка: ${data.error || "Не удалось обновить бронирование"}`);
                }
            } catch (error) {
                console.error("Ошибка при обновлении бронирования:", error);
                alert("Не удалось обновить бронирование.");
            }
        } else {
            alert("Все поля должны быть заполнены.");
        }
    });

    // Кнопка "Удалить бронирование"
    document.getElementById("delete-booking").addEventListener("click", async () => {
        const id = prompt("Введите ID бронирования для удаления:");
        console.log('Отправляем токен:', getToken());

        if (id) {
            if (!isAuthenticated()) {
                alert("Вы должны авторизоваться, чтобы управлять бронированием.");
                return;
            }
            try {
                const response = await fetch(`http://localhost:8080/booking/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${getToken()}`
                    },
                });

                if (response.ok) {
                    alert("Бронирование успешно удалено");
                    fetchBookings(); // Обновляем список бронирований
                } else {
                    alert(`Ошибка: ${response.statusText}`);
                }
            } catch (error) {
                console.error("Ошибка при удалении бронирования:", error);
                alert("Не удалось удалить бронирование.");
            }
        } else {
            alert("ID бронирования должен быть указан.");
        }
    });

    // Сортировка
    document.getElementById("sort-date").addEventListener("click", () => {
        const filter = document.getElementById("filter-field").value;
        fetchBookings(1, "date", filter);
    });
    document.getElementById("sort-time").addEventListener("click", () => {
        const filter = document.getElementById("filter-field").value;
        fetchBookings(1, "time", filter);
    });

    // Фильтрация
    document.getElementById("filter-field").addEventListener("change", (event) => {
        fetchBookings(1, "", event.target.value);
    });

    // Пагинация
    function renderPagination(totalPages, currentPage, sort, filter) {
        if (totalPages <= 1) {
            document.getElementById("pagination").innerHTML = "";
            return;
        }

        const buttons = Array.from({ length: totalPages }, (_, i) => {
            const page = i + 1;
            return `
                <button class="${page === currentPage ? "active" : ""}" onclick="fetchBookings(${page}, '${sort}', '${filter}')">
                    ${page}
                </button>
            `;
        }).join("");

        document.getElementById("pagination").innerHTML = buttons;
    }
