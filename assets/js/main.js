// // открытие полного комментария
// document.addEventListener('DOMContentLoaded', () => {
//     document.querySelectorAll('.comment_text_card').forEach((card) => {
//         const textEl = card.querySelector('.comment_text');
//         const btn = card.querySelector('.read_more_btn');
//         let expanded = false;
//         let collapsedHeight = 0;

//         requestAnimationFrame(() => {
//             const isClamped = textEl.scrollHeight > textEl.clientHeight + 1;
//             if (!isClamped) {
//                 btn.remove();
//                 return;
//             }
//             collapsedHeight = textEl.clientHeight;
//             textEl.style.maxHeight = collapsedHeight + 'px';
//             btn.classList.add('is-visible');
//         });

//         btn.addEventListener('click', () => {
//             expanded = !expanded;

//             if (expanded) {
//                 textEl.classList.add('is-expanded');
//                 const fullHeight = textEl.scrollHeight;
//                 requestAnimationFrame(() => {
//                     textEl.style.maxHeight = fullHeight + 'px';
//                 });
//             } else {
//                 const fullHeight = textEl.scrollHeight;
//                 textEl.style.maxHeight = fullHeight + 'px';
//                 textEl.offsetHeight;

//                 requestAnimationFrame(() => {
//                     textEl.style.maxHeight = collapsedHeight + 'px';
//                 });
//             }

//             btn.textContent = expanded ? 'Свернуть' : 'Читать полностью';
//         });

//         textEl.addEventListener('transitionend', (e) => {
//             if (e.propertyName !== 'max-height') return;
//             if (expanded) {
//                 textEl.style.maxHeight = 'none';
//             } else {
//                 textEl.classList.remove('is-expanded');
//             }
//         });
//     });
// });

// видео
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.video_frame[data-src]').forEach((wrapper) => {
        wrapper.addEventListener('click', () => {
            const baseSrc = wrapper.dataset.src;
            const separator = baseSrc.includes('?') ? '&' : '?';
            const src = baseSrc + separator + 'autoplay=1';

            const iframe = document.createElement('iframe');
            iframe.src = src;
            iframe.width = '100%';
            iframe.height = '600';
            iframe.style.border = 'none';
            iframe.allow = 'clipboard-write; autoplay; fullscreen';
            iframe.allowFullscreen = true;

            wrapper.innerHTML = '';
            wrapper.appendChild(iframe);
            wrapper.style.cursor = 'default';
        }, { once: true });
    });
});

// вопрос ответ
document.addEventListener('DOMContentLoaded', () => {
    const section = document.querySelector('.text_block--v7_faq_section');
    if (!section) return;

    const bullets = Array.from(section.querySelectorAll('.small_bullet'));
    const cards = Array.from(section.querySelectorAll('.text_block--v7_faq_card'));

    function showCategory(category) {
        cards.forEach((card) => {
            card.style.display = card.dataset.category === category ? '' : 'none';
        });
    }

    function setActiveBullet(bullet) {
        bullets.forEach((b) => b.classList.toggle('active', b === bullet));
    }

    function openCard(card) {
        const answer = card.querySelector('.text_block--v7_faq_answer');
        card.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
    }

    function closeCard(card) {
        const answer = card.querySelector('.text_block--v7_faq_answer');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        answer.offsetHeight;
        requestAnimationFrame(() => {
            answer.style.maxHeight = '0px';
        });
        card.classList.remove('active');
    }

    bullets.forEach((bullet) => {
        bullet.addEventListener('click', () => {
            setActiveBullet(bullet);
            showCategory(bullet.dataset.category);
            cards.forEach((card) => {
                if (card.classList.contains('active')) closeCard(card);
            });
        });
    });

    cards.forEach((card) => {
        const question = card.querySelector('.text_block--v7_faq_question');
        const answer = card.querySelector('.text_block--v7_faq_answer');

        question.addEventListener('click', () => {
            const isOpen = card.classList.contains('active');

            cards.forEach((c) => {
                if (c !== card && c.classList.contains('active')) closeCard(c);
            });

            if (isOpen) {
                closeCard(card);
            } else {
                openCard(card);
            }
        });

        answer.addEventListener('transitionend', (e) => {
            if (e.propertyName !== 'max-height') return;
            if (card.classList.contains('active')) {
                answer.style.maxHeight = 'none';
            }
        });

        if (card.classList.contains('active')) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
    });

    const initialBullet = bullets.find((b) => b.classList.contains('active')) || bullets[0];
    if (initialBullet) {
        setActiveBullet(initialBullet);
        showCategory(initialBullet.dataset.category);
    }
});

// переключатель категорий
document.addEventListener('DOMContentLoaded', function () {
    const filterGroups = {};

    document.querySelectorAll('[data-filter-target]').forEach(function (el) {
        const key = el.dataset.filterTarget;
        if (!filterGroups[key]) {
            filterGroups[key] = { filterSection: null, cardsContainer: null };
        }
        if (el.classList.contains('filter_section')) {
            filterGroups[key].filterSection = el;
        } else {
            filterGroups[key].cardsContainer = el;
        }
    });

    Object.values(filterGroups).forEach(function (group) {
        const { filterSection, cardsContainer } = group;
        if (!filterSection || !cardsContainer) return;

        const buttons = filterSection.querySelectorAll('.filter_card');
        const cards = cardsContainer.querySelectorAll('[data-category]');

        function applyFilter(category) {
            cards.forEach(function (card) {
                if (category === 'all' || card.dataset.category === category) {
                    card.classList.remove('is-hidden');
                } else {
                    card.classList.add('is-hidden');
                }
            });
        }

        buttons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                buttons.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                applyFilter(btn.dataset.filter);
            });
        });

        const initialBtn = filterSection.querySelector('.filter_card.active') || buttons[0];
        if (initialBtn) applyFilter(initialBtn.dataset.filter);
    });
});
// открытие информации у специалиста 
document.addEventListener('DOMContentLoaded', function () {
    const MAX_HEIGHT = 300;

    document.querySelectorAll('.specialist_information_card').forEach(function (card) {
        const lists = card.querySelectorAll('.request_information_content');
        const btn = card.querySelector('.request_toggle_btn');
        if (!lists.length || !btn) return;

        let needsButton = false;
        const fullHeights = [];

        lists.forEach(function (list, i) {
            list.style.maxHeight = 'none';
            const fullHeight = list.scrollHeight;
            fullHeights[i] = fullHeight;

            if (fullHeight > MAX_HEIGHT) {
                needsButton = true;
                list.style.maxHeight = MAX_HEIGHT + 'px';
            } else {
                list.style.maxHeight = fullHeight + 'px';
            }
        });

        if (!needsButton) return;

        btn.style.display = 'inline-block';

        btn.addEventListener('click', function () {
            const isExpanded = btn.dataset.state === 'expanded';

            lists.forEach(function (list, i) {
                if (fullHeights[i] > MAX_HEIGHT) {
                    list.style.maxHeight = isExpanded ? MAX_HEIGHT + 'px' : fullHeights[i] + 'px';
                }
            });

            btn.dataset.state = isExpanded ? 'collapsed' : 'expanded';
            btn.textContent = isExpanded ? 'Показать все' : 'Скрыть';
        });
    });
});

// динамическое открытие попапа
document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[id^="open"]');
    if (trigger) {
        const popupId = trigger.id.replace(/^open/, '');
        const popup = document.getElementById(popupId[0].toLowerCase() + popupId.slice(1));
        popup?.classList.toggle('active');
        return;
    }
    if (e.target.closest('.popup_close')) {
        e.target.closest('.popup_background')?.classList.remove('active');
        return;
    }
    if (e.target.classList.contains('popup_background')) {
        e.target.classList.remove('active');
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.popup_background.active').forEach(p => p.classList.remove('active'));
    }
});


// календарь дата или год/месяц
document.addEventListener('DOMContentLoaded', function () {
    const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    const MONTHS_SHORT = ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    const WEEKDAY_OFFSET = 1; // неделя начинается с понедельника

    const popup = document.querySelector('.popup_session');
    if (!popup) return;

    const calendar = document.getElementById('miniCalendar');
    const monthToggleBtn = calendar.querySelector('.mini_calendar_month_toggle');
    const monthLabel = calendar.querySelector('.mini_calendar_month_label');
    const closeBtn = calendar.querySelector('.mini_calendar_close');
    const daysView = calendar.querySelector('.mini_calendar_days_view');
    const monthYearView = calendar.querySelector('.mini_calendar_month_year_view');
    const grid = calendar.querySelector('.mini_calendar_grid');
    const yearPill = calendar.querySelector('.mini_calendar_year_pill');
    const monthsGrid = calendar.querySelector('.mini_calendar_months_grid');
    const yearsList = calendar.querySelector('.mini_calendar_years_list');

    let activeField = null;
    let viewMonth = 6;
    let viewYear = 2026;
    let selectedDates = {};

    popup.querySelectorAll('.date_field').forEach(function (field) {
        const raw = field.dataset.date;
        if (raw) {
            const [y, m, d] = raw.split('-').map(Number);
            selectedDates[field.dataset.field] = { y: y, m: m - 1, d: d };
        }
    });

    function formatDateLabel(y, m, d) {
        return d + ' ' + monthGenitive(m) + ', ' + y;
    }

    function monthGenitive(m) {
        const genitive = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
        return genitive[m];
    }

    function openCalendar(fieldBtn) {
        activeField = fieldBtn;

        const sel = selectedDates[fieldBtn.dataset.field];
        viewMonth = sel ? sel.m : new Date().getMonth();
        viewYear = sel ? sel.y : new Date().getFullYear();

        positionCalendar(fieldBtn);
        showDaysView();
        renderDaysGrid();

        calendar.hidden = false;
        popup.querySelectorAll('.date_field').forEach(f => f.classList.remove('active'));
        fieldBtn.classList.add('active');
    }

    function closeCalendar() {
        calendar.hidden = true;
        activeField = null;
        popup.querySelectorAll('.date_field').forEach(f => f.classList.remove('active'));
    }

    function positionCalendar(fieldBtn) {
        const fieldRect = fieldBtn.getBoundingClientRect();
        const popupRect = popup.getBoundingClientRect();

        calendar.style.top = (fieldRect.bottom - popupRect.top + popup.scrollTop + 6) + 'px';
        calendar.style.left = (fieldRect.left - popupRect.left) + 'px';
    }

    function showDaysView() {
        daysView.hidden = false;
        monthYearView.hidden = true;
        monthToggleBtn.classList.remove('expanded');
        monthLabel.textContent = MONTHS[viewMonth] + ', ' + viewYear;
    }

    function showMonthYearView() {
        daysView.hidden = true;
        monthYearView.hidden = false;
        monthToggleBtn.classList.add('expanded');
        renderMonthYearView();
    }

    monthToggleBtn.addEventListener('click', function () {
        if (monthYearView.hidden) {
            showMonthYearView();
        } else {
            showDaysView();
            renderDaysGrid();
        }
    });

    closeBtn.addEventListener('click', closeCalendar);

    document.addEventListener('click', function (e) {
        if (!calendar.hidden && !calendar.contains(e.target) && !e.target.closest('.date_field')) {
            closeCalendar();
        }
    });

    function renderDaysGrid() {
        grid.innerHTML = '';

        const firstDay = new Date(viewYear, viewMonth, 1);
        let startWeekday = firstDay.getDay() - WEEKDAY_OFFSET;
        if (startWeekday < 0) startWeekday += 7;

        const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
        const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

        const sel = activeField ? selectedDates[activeField.dataset.field] : null;

        for (let i = startWeekday - 1; i >= 0; i--) {
            const dayBtn = createDayBtn(daysInPrevMonth - i, true);
            grid.appendChild(dayBtn);
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const isSelected = sel && sel.y === viewYear && sel.m === viewMonth && sel.d === d;
            const dayBtn = createDayBtn(d, false, isSelected);
            grid.appendChild(dayBtn);
        }

        const totalCells = startWeekday + daysInMonth;
        const remaining = (7 - (totalCells % 7)) % 7;
        for (let d = 1; d <= remaining; d++) {
            grid.appendChild(createDayBtn(d, true));
        }
    }

    function createDayBtn(day, isOtherMonth, isSelected) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'mini_calendar_day text-micro fw-reg' + (isOtherMonth ? ' other_month' : '') + (isSelected ? ' selected' : '');
        btn.textContent = day;

        if (!isOtherMonth) {
            btn.addEventListener('click', function () {
                if (!activeField) return;
                selectedDates[activeField.dataset.field] = { y: viewYear, m: viewMonth, d: day };
                const valueEl = activeField.querySelector('.date_field_value');
                valueEl.textContent = formatDateLabel(viewYear, viewMonth, day);
                closeCalendar();
            });
        }

        return btn;
    }

    function renderMonthYearView() {
        yearPill.textContent = viewYear;

        monthsGrid.innerHTML = '';
        MONTHS_SHORT.forEach(function (name, index) {
            const span = document.createElement('span');
            span.textContent = name;
            if (index === viewMonth) span.classList.add('active');
            span.addEventListener('click', function () {
                viewMonth = index;
                showDaysView();
                renderDaysGrid();
            });
            monthsGrid.appendChild(span);
        });

        yearsList.innerHTML = '';
        const currentYear = new Date().getFullYear();
        for (let y = currentYear; y <= currentYear + 3; y++) {
            const span = document.createElement('span');
            span.textContent = y;
            span.addEventListener('click', function () {
                viewYear = y;
                renderMonthYearView();
            });
            yearsList.appendChild(span);
        }
    }

    popup.querySelectorAll('.date_field').forEach(function (field) {
        field.addEventListener('click', function (e) {
            e.stopPropagation();
            if (activeField === field && !calendar.hidden) {
                closeCalendar();
            } else {
                openCalendar(field);
            }
        });
    });

    popup.querySelectorAll('.time_option').forEach(function (btn) {
        btn.addEventListener('click', function () {
            popup.querySelectorAll('.time_option').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });

    popup.querySelector('.popup_close').addEventListener('click', function () {
        popup.closest('.popup_background').remove();
    });

    document.getElementById('sessionSubmitBtn').addEventListener('click', function (e) {
        e.preventDefault();

        const format = popup.querySelector('input[name="session_format"]:checked');
        const selectedTime = popup.querySelector('.time_option.selected');
        const fullName = popup.querySelector('input[name="full_name"]').value.trim();
        const phone = popup.querySelector('input[name="phone"]').value.trim();
        const email = popup.querySelector('input[name="email"]').value.trim();

        if (!format || !selectedTime || !fullName || !phone || !email) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }

        const payload = {
            format: format.value,
            price: format.dataset.price,
            date_from: selectedDates.from,
            date_to: selectedDates.to,
            time: selectedTime.dataset.time,
            full_name: fullName,
            phone: phone,
            email: email
        };

        console.log('Отправка записи на сессию:', payload);
    });
});
// блюр
document.addEventListener('DOMContentLoaded', () => {
    const popupBackground = document.getElementById('sessionPopup');
    const popup = document.querySelector('.popup_session');
    const footer = document.querySelector('.session_form_footer');
    if (!popupBackground || !popup || !footer) return;

    function updateFooterFade() {
        const hasMore = popup.scrollHeight - popup.scrollTop - popup.clientHeight > 4;
        footer.classList.toggle('has-more-content', hasMore);
    }

    popup.addEventListener('scroll', updateFooterFade);
    window.addEventListener('resize', updateFooterFade);
    new MutationObserver(updateFooterFade).observe(popupBackground, { attributes: true, attributeFilter: ['class'] });
    updateFooterFade();
});

// маска
document.addEventListener('DOMContentLoaded', () => {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');

    function formatPhone(rawValue) {
        let digits = rawValue.replace(/\D/g, '');
        if (digits.startsWith('8')) digits = '7' + digits.slice(1);
        if (digits && !digits.startsWith('7')) digits = '7' + digits;
        digits = digits.slice(0, 11).slice(1);

        if (!digits) return '';

        let result = '+7 (' + digits.slice(0, 3);
        if (digits.length >= 3) result += ')';
        if (digits.length > 3) result += ' ' + digits.slice(3, 6);
        if (digits.length > 6) result += '-' + digits.slice(6, 8);
        if (digits.length > 8) result += '-' + digits.slice(8, 10);

        return result;
    }

    phoneInputs.forEach((input) => {
        input.addEventListener('input', () => {
            input.value = formatPhone(input.value);
        });

        input.addEventListener('focus', () => {
            if (!input.value) input.value = '+7 (';
        });

        input.addEventListener('blur', () => {
            const digits = input.value.replace(/\D/g, '').slice(1);
            if (!digits) input.value = '';
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && input.value === '+7 (') {
                e.preventDefault();
                input.value = '';
            }
        });
    });
});

// comment popup
document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('commentPopup');
    const popupAvatar = popup.querySelector('.popup_comment_avatar');
    const popupName = popup.querySelector('.popup_comment_name');
    const popupRole = popup.querySelector('.popup_comment_role');
    const popupText = popup.querySelector('.popup_comment_text');

    document.querySelectorAll('.comment_text_card').forEach((card) => {
        const textEl = card.querySelector('.comment_text');
        const btn = card.querySelector('.read_more_btn');

        requestAnimationFrame(() => {
            const isClamped = textEl.scrollHeight > textEl.clientHeight + 1;
            if (!isClamped) {
                btn.remove();
                return;
            }
            btn.classList.add('is-visible');
        });

        btn.addEventListener('click', () => {
            popupAvatar.src = card.querySelector('.image_user img').src;
            popupName.textContent = card.querySelector('.minimum_info_user h4').textContent;
            popupRole.textContent = card.querySelector('.minimum_info_user p').textContent;

            popupText.innerHTML = '';
            textEl.textContent
                .split(/\n\s*\n/)
                .map((p) => p.trim())
                .filter(Boolean)
                .forEach((paragraph) => {
                    const p = document.createElement('p');
                    p.textContent = paragraph;
                    popupText.appendChild(p);
                });

            popup.classList.add('active');
        });
    });
});