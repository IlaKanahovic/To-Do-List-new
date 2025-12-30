

class LocalStorage {
    selectors = {
        buttonTaskAddElement: '.btn-add',
        containerToDoListTasks: '.tasks-container',
        templateTaskElement: '.template__task-element',
        inputNameTask: '.form-input-name-task',
        textareaDescriptionTask: '.form-textarea-description-task',
        checkboxTaskElement: '.task-checkbox',
        deleteTaskButtonElement: '.task-delete',
        taskTitleNameElement: '.task-title-name',
        taskDescriptionElement: '.task-desc',
        buttonSaveTask: '.btn-save',
        modalsOverlayAddTaskElement: '.modal-overlay',
        modalsButtonClose: '.modal-close',
        modalsButtonCancel: '.btn-cancel',
        taskCard: '.task-card',
    }

    constructor() {
        this.buttonTaskAddElement = document.querySelector(this.selectors.buttonTaskAddElement)

        this.containerToDoListTasks = document.querySelector(this.selectors.containerToDoListTasks)

        this.templateTaskElement = document.querySelector(this.selectors.templateTaskElement)

        this.inputNameTask = document.querySelector(this.selectors.inputNameTask)

        this.textareaDescriptionTask = document.querySelector(this.selectors.textareaDescriptionTask)

        this.checkboxTaskElement = document.querySelector(this.selectors.checkboxTaskElement)

        this.deleteTaskButtonElement = document.querySelector(this.selectors.deleteTaskButtonElement)

        this.buttonSaveTask = document.querySelector(this.selectors.buttonSaveTask)

        this.modalsOverlayAddTaskElement = document.querySelector(this.selectors.modalsOverlayAddTaskElement)

        this.modalsButtonClose = document.querySelector(this.selectors.modalsButtonClose)

        this.modalsButtonCancel = document.querySelector(this.selectors.modalsButtonCancel)

        this.taskCard = document.querySelector(this.selectors.taskCard)

        this.bindEvents()

        this.tasks = []

        this.currentFilter = 'all'

        this.loadTasks()
        this.renderTasks()
    }

    openWindowAdd() {
        if (!this.modalsOverlayAddTaskElement.classList.contains('active')) {
            this.modalsOverlayAddTaskElement.classList.add('active')
        }
        document.body.classList.add('modal-open');
    }

    getFilteredTasks() {
        if (this.currentFilter === 'active') {
            return this.tasks.filter(task => !task.completed)
        }
        if (this.currentFilter == 'completed') {
            return this.tasks.filter(task => task.completed)
        }
        return this.tasks
    }

    getCurrentDateTime() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const day = now.getDate();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        const formatNumber = (num) => (num < 10 ? '0' + num : num);
        const shortYear = year.toString().slice(-2);

        return `${formatNumber(hours)}:${formatNumber(minutes)} ${formatNumber(day)}.${formatNumber(month)}.${shortYear}`;
    }

    createTaskElement(task) {
        const cloneEl = this.templateTaskElement.content.cloneNode(true)
        const idUserSearch = cloneEl.querySelector('.task-card')
        const nameCloneElement = cloneEl.querySelector('.task-title')
        const descriptionCloneElement = cloneEl.querySelector('.task-desc')
        const dateNowTaskElement = cloneEl.querySelector('.task-date')
        const checkBoxChangeText = cloneEl.querySelector('.task-checkbox')
        const deleteTaskButton = cloneEl.querySelector('.task-delete')
        const taskPriorityStrip = cloneEl.querySelector('.task-priority-strip')

        idUserSearch.setAttribute('data-id-user', task.id)
        nameCloneElement.textContent = task.nameTask
        descriptionCloneElement.textContent = task.descTask
        dateNowTaskElement.textContent = task.dateNow

        if (task.priority === 'low') {
            taskPriorityStrip.classList.add('low')
        } else if (task.priority === 'medium') {
            taskPriorityStrip.classList.add('medium')
        } else if (task.priority === 'high') {
            taskPriorityStrip.classList.add('high')
        }

        if (task.completed === true) {
            descriptionCloneElement.classList.add('checkbox-text-change-active')
            nameCloneElement.classList.add('checkbox-text-change-active')
            checkBoxChangeText.checked = true
        }

        this.attachCheckboxHandler(checkBoxChangeText, descriptionCloneElement, nameCloneElement)
        this.dattachDeleteHandler(deleteTaskButton)

        this.containerToDoListTasks.appendChild(cloneEl)
    }

    addendumElement() {
        if (this.inputNameTask.value.trim() === '') return

        const inputPriorityStripElement = document.querySelector('input[name="priority"]:checked')
        const id = Date.now()
        const completed = false
        const userTask = {
            id: id,
            nameTask: this.inputNameTask.value,
            descTask: this.textareaDescriptionTask.value,
            priority: inputPriorityStripElement.value,
            dateNow: this.getCurrentDateTime(),
            completed: completed,
        }
        this.tasks.push(userTask)
        this.saveTask()
        this.renderTasks()

        this.modalsOverlayAddTaskElement.classList.remove('active')
        document.body.classList.remove('modal-open');
        this.inputNameTask.value = ''
        this.textareaDescriptionTask.value = ''
    }

    saveTask() {
        try {
            localStorage.setItem(
                'user',
                JSON.stringify(this.tasks)
            )
        } catch (error) {
            console.log('Возникла ошибка:', error)
        }
    }

    loadTasks() {
        const convertingArrayToString = JSON.parse(localStorage.getItem('user'))
        console.log(convertingArrayToString)  // откладка

        if (convertingArrayToString) {
            this.tasks = convertingArrayToString
        } else {
            this.tasks = []
        }
    }

    renderTasks() {
        this.containerToDoListTasks.innerHTML = ''

        const tasksFilterContainer = this.getFilteredTasks()

        tasksFilterContainer.forEach(task => {
            this.createTaskElement(task)
        })
    }

    attachCheckboxHandler(checkBoxChangeText, descriptionCloneElement, nameCloneElement) {
        checkBoxChangeText.addEventListener('change', (event) => {
            console.log('checkbox true') // отклакда
            if (event.target.checked) {
                const listEl = event.currentTarget.closest(this.selectors.taskCard)
                if (listEl) {
                    const idTask = Number(listEl.getAttribute('data-id-user'))
                    const taskIndex = this.tasks.findIndex(task => task.id === idTask)
                    if (taskIndex !== -1) {
                        this.tasks[taskIndex].completed = true
                    }
                    this.saveTask()
                }
                descriptionCloneElement.classList.add('checkbox-text-change-active')
                nameCloneElement.classList.add('checkbox-text-change-active')
            } else {
                const listEl = event.currentTarget.closest(this.selectors.taskCard)
                if (listEl) {
                    const idTask = Number(listEl.getAttribute('data-id-user'))
                    const taskIndex = this.tasks.findIndex(task => task.id === idTask)
                    if (taskIndex !== -1) {
                        this.tasks[taskIndex].completed = false
                    }
                    this.saveTask()
                }
                descriptionCloneElement.classList.remove('checkbox-text-change-active')
                nameCloneElement.classList.remove('checkbox-text-change-active')
            }
            this.renderTasks()
        })
    }

    dattachDeleteHandler(deleteTaskButton) {
        deleteTaskButton.addEventListener('click', (event) => {
            console.log('delete true') // отклакда
            const listEl = event.currentTarget.closest(this.selectors.taskCard)
            if (listEl) {
                const idTask = Number(listEl.getAttribute('data-id-user'))
                const taskIndex = this.tasks.findIndex(task => task.id === idTask)
                if (taskIndex !== -1) {
                    this.tasks.splice(taskIndex, 1)
                }
                this.saveTask()
                listEl.remove()
            }
        })
    }

    handleFilterChange(event) {
        const targetButton = event.currentTarget
        const filterType = targetButton.getAttribute('data-filter')

        this.currentFilter = filterType

        const filterElement = document.querySelectorAll('.filter')
        filterElement.forEach(btn => {
            btn.classList.remove('active')
        })
        targetButton.classList.add('active')

        this.renderTasks()
    }

    bindEvents() {
        if (this.buttonTaskAddElement) {
            this.buttonTaskAddElement.addEventListener('click', this.openWindowAdd.bind(this))
        }

        if (this.buttonSaveTask) {
            this.buttonSaveTask.addEventListener('click', this.addendumElement.bind(this))
        }

        if (this.modalsButtonCancel) {
            this.modalsButtonCancel.addEventListener('click', () => {
                this.modalsOverlayAddTaskElement.classList.remove('active')
                document.body.classList.remove('modal-open');
            })
        }

        if (this.modalsButtonClose) {
            this.modalsButtonClose.addEventListener('click', () => {
                this.modalsOverlayAddTaskElement.classList.remove('active')
                document.body.classList.remove('modal-open');
            })
        }

        const filterButtons = document.querySelectorAll('.filter')
        filterButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                this.handleFilterChange(event)
            })
        })
    }
}

new LocalStorage()




//! А это просто убитые часы жизни, ну главное получилось

// class DragAndDrop {
//     constructor(onReorder) {
//         this.onReorder = onReorder;
//         this.draggedElement = null;
//     }

//     init(container) {
//         const containerElement = document.querySelector(container)

//         if (!containerElement) {
//             console.log('Container not found')
//             return
//         }

//         this.container = containerElement

//         containerElement.addEventListener('dragover', (event) => {
//             event.preventDefault()
//             this.handleDragOver(event)
//         })
//         containerElement.addEventListener('drop', (event) => {
//             event.preventDefault()
//             this.handleDrop(event)
//         })

//         const taskCards = containerElement.querySelectorAll('.task-card')
//         if (taskCards.length === 0) return true

//         taskCards.forEach(card => {
//             card.setAttribute('draggable', 'true')
//             card.addEventListener('dragstart', this.handleDragStart.bind(this))

//             if (!card.hasAttribute('data-id-user')) {
//                 console.warn('Task not data-id-user:', card)
//             }
//         })

//         return true
//     }

//     handleDragStart(event) {
//         const draggedElement = event.target.closest('.task-card')
//         if (!draggedElement) {
//             event.preventDefault()
//             return
//         }

//         this.draggedElement = draggedElement

//         const taskId = draggedElement.getAttribute('data-id-user')
//         if (!taskId) {
//             event.preventDefault()
//             return
//         }

//         // =========
//         // делала gpt (я вообще это не понимаю)
//         // Сохранить ID для передачи
//         event.dataTransfer.setData('text/plain', taskId)

//         // Установить тип операции
//         event.dataTransfer.effectAllowed = 'move'
//         // =========

//         draggedElement.classList.add('dragging')
//     }

//     handleDragOver(event) {
//         event.preventDefault()
//         event.dataTransfer.dropEffect = 'move'

//         const targetCard = event.target.closest('.task-card')
//         if (!targetCard || targetCard === this.draggedElement) {
//             this.removeDropIndicators()
//             return
//         }

//         const cardRect = targetCard.getBoundingClientRect()
//         const cardCenterY = cardRect.top + cardRect.height / 2
//         const insertAbove = event.clientY < cardCenterY

//         this.removeDropIndicators()


//         if (insertAbove) {
//             targetCard.classList.add('drag-over-above')
//         } else {
//             targetCard.classList.add('drag-over-below')
//         }

//         this.dropTarget = targetCard
//         this.insertPosition = insertAbove ? 'above' : 'below'
//     }

//     removeDropIndicators() {
//         if (this.container) {
//             const allCards = this.container.querySelectorAll('.task-card')
//             allCards.forEach(card => {
//                 card.classList.remove('drag-over-above')
//                 card.classList.remove('drag-over-below')
//             })
//         }
//     }

//     clearingEffects() {
//         this.removeDropIndicators()

//         if (this.draggedElement) {
//             this.draggedElement.classList.remove('dragging')
//         }

//         this.draggedElement = null
//         this.dropTarget = null
//         this.insertPosition = null
//     }

//     handleDrop(event) {
//         event.preventDefault()

//         const draggedId = event.dataTransfer.getData('text/plain')
//         if (!draggedId) {
//             return
//         }

//         let targetCard = this.dropTarget
//         if (targetCard === null) {
//             targetCard = event.target.closest('.task-card')
//         }

//         if (targetCard === null) {
//             this.clearingEffects()
//             return
//         }

//         const targetId = targetCard.getAttribute('data-id-user')
//         if (targetId === undefined) {
//             this.clearingEffects()
//             return
//         }

//         if (draggedId === targetId) {
//             this.clearingEffects()
//             return
//         }

//         this.onReorder(draggedId, targetId, this.insertPosition)

//         this.clearingEffects()
//     }
// }

// class LocalStorage {
//     selectors = {
//         buttonTaskAddElement: '.btn-add',
//         containerToDoListTasks: '.tasks-container',
//         templateTaskElement: '.template__task-element',
//         inputNameTask: '.form-input-name-task',
//         textareaDescriptionTask: '.form-textarea-description-task',
//         checkboxTaskElement: '.task-checkbox',
//         deleteTaskButtonElement: '.task-delete',
//         taskTitleNameElement: '.task-title-name',
//         taskDescriptionElement: '.task-desc',
//         buttonSaveTask: '.btn-save',
//         modalsOverlayAddTaskElement: '.modal-overlay',
//         modalsButtonClose: '.modal-close',
//         modalsButtonCancel: '.btn-cancel',
//         taskCard: '.task-card',
//         changeTaskButtonElement: '.task-change',
//         changeTaskModals: '.modal-overlay-change',
//     }

//     constructor() {
//         this.buttonTaskAddElement = document.querySelector(this.selectors.buttonTaskAddElement)

//         this.containerToDoListTasks = document.querySelector(this.selectors.containerToDoListTasks)

//         this.templateTaskElement = document.querySelector(this.selectors.templateTaskElement)

//         this.inputNameTask = document.querySelector(this.selectors.inputNameTask)

//         this.textareaDescriptionTask = document.querySelector(this.selectors.textareaDescriptionTask)

//         this.checkboxTaskElement = document.querySelector(this.selectors.checkboxTaskElement)

//         this.deleteTaskButtonElement = document.querySelector(this.selectors.deleteTaskButtonElement)

//         this.buttonSaveTask = document.querySelector(this.selectors.buttonSaveTask)

//         this.modalsOverlayAddTaskElement = document.querySelector(this.selectors.modalsOverlayAddTaskElement)

//         this.modalsButtonClose = document.querySelector(this.selectors.modalsButtonClose)

//         this.modalsButtonCancel = document.querySelector(this.selectors.modalsButtonCancel)

//         this.taskCard = document.querySelector(this.selectors.taskCard)

//         this.changeTaskButtonElement = document.querySelector(this.selectors.changeTaskButtonElement)

//         this.changeTaskModals = document.querySelector(this.selectors.changeTaskModals)

//         this.bindEvents()

//         this.tasks = []

//         this.currentFilter = 'all'

//         this.loadTasks()

//         this.dragDropManager = new DragAndDrop((draggedId, targetId, position) => {
//             this.reorderTasks(draggedId, targetId, position)
//         })
//     }

//     reorderTasks(draggedId, targetId) {
//         // draggedId — id задачи, которую перетащили
//         // targetId — id задачи, НА которую перетащили(или ПЕРЕД которой)
//         if (!draggedId || !targetId) return

//         const draggedIndex = this.tasks.findIndex(task => task.id == draggedId)
//         const targetIndex = this.tasks.findIndex(task => task.id == targetId)

//         if (draggedIndex === targetIndex) return

//         const [draggedTask] = this.tasks.splice(draggedIndex, 1)

//         let newPositionTask = targetIndex

//         if (draggedIndex < targetIndex) {
//             newPositionTask = targetIndex - 1
//         } else {
//             newPositionTask = targetIndex + 1
//         }

//         this.tasks.splice(newPositionTask, 0, draggedTask)

//         this.tasks.forEach((task, index) => {
//             task.order = index
//         })

//         this.saveTask()
//         this.renderTasks()
//     }

//     openWindowAdd() {
//         if (!this.modalsOverlayAddTaskElement.classList.contains('active')) {
//             this.modalsOverlayAddTaskElement.classList.add('active')
//         }
//         document.body.classList.add('modal-open');
//     }

//     changeTaskWindowOpen() {
//         if (!this.changeTaskModals.classList.contains('active')) {
//             this.changeTaskModals.classList.add('active')
//         }
//     }

//     getFilteredTasks(tasksArray = this.tasks) {
//         if (this.currentFilter === 'active') {
//             return tasksArray.filter(task => !task.completed)
//         }
//         if (this.currentFilter == 'completed') {
//             return tasksArray.filter(task => task.completed)
//         }
//         return tasksArray
//     }

//     getCurrentDateTime() {
//         const now = new Date();
//         const hours = now.getHours();
//         const minutes = now.getMinutes();
//         const day = now.getDate();
//         const month = now.getMonth() + 1;
//         const year = now.getFullYear();

//         const formatNumber = (num) => (num < 10 ? '0' + num : num);
//         const shortYear = year.toString().slice(-2);

//         return `${formatNumber(hours)}:${formatNumber(minutes)} ${formatNumber(day)}.${formatNumber(month)}.${shortYear}`;
//     }

//     createTaskElement(task) {
//         const cloneEl = this.templateTaskElement.content.cloneNode(true)
//         const idUserSearch = cloneEl.querySelector('.task-card')
//         const nameCloneElement = cloneEl.querySelector('.task-title')
//         const descriptionCloneElement = cloneEl.querySelector('.task-desc')
//         const dateNowTaskElement = cloneEl.querySelector('.task-date')
//         const checkBoxChangeText = cloneEl.querySelector('.task-checkbox')
//         const deleteTaskButton = cloneEl.querySelector('.task-delete')
//         const taskPriorityStrip = cloneEl.querySelector('.task-priority-strip')

//         idUserSearch.setAttribute('data-id-user', task.id)
//         nameCloneElement.textContent = task.nameTask
//         descriptionCloneElement.textContent = task.descTask
//         dateNowTaskElement.textContent = task.dateNow

//         if (task.priority === 'low') {
//             taskPriorityStrip.classList.add('low')
//         } else if (task.priority === 'medium') {
//             taskPriorityStrip.classList.add('medium')
//         } else if (task.priority === 'high') {
//             taskPriorityStrip.classList.add('high')
//         }

//         if (task.completed === true) {
//             descriptionCloneElement.classList.add('checkbox-text-change-active')
//             nameCloneElement.classList.add('checkbox-text-change-active')
//             checkBoxChangeText.checked = true
//         }

//         this.attachCheckboxHandler(checkBoxChangeText, descriptionCloneElement, nameCloneElement)
//         this.dattachDeleteHandler(deleteTaskButton)

//         this.containerToDoListTasks.appendChild(cloneEl)
//     }

//     addendumElement() {
//         if (this.inputNameTask.value.trim() === '') return

//         const inputPriorityStripElement = document.querySelector('input[name="priority"]:checked')
//         const id = Date.now()
//         const completed = false
//         const userTask = {
//             id: id,
//             order: this.tasks.length,
//             nameTask: this.inputNameTask.value,
//             descTask: this.textareaDescriptionTask.value,
//             priority: inputPriorityStripElement.value,
//             dateNow: this.getCurrentDateTime(),
//             completed: completed,
//         }
//         this.tasks.push(userTask)
//         this.saveTask()
//         this.renderTasks()

//         this.modalsOverlayAddTaskElement.classList.remove('active')
//         document.body.classList.remove('modal-open');
//         this.inputNameTask.value = ''
//         this.textareaDescriptionTask.value = ''
//     }

//     saveTask() {
//         try {
//             localStorage.setItem(
//                 'user',
//                 JSON.stringify(this.tasks)
//             )
//         } catch (error) {
//             console.log('Возникла ошибка:', error)
//         }
//     }

//     loadTasks() {
//         const convertingArrayToString = JSON.parse(localStorage.getItem('user'))
//         console.log(convertingArrayToString)  // откладка

//         if (convertingArrayToString) {
//             this.tasks = convertingArrayToString

//             this.tasks.forEach((task, index) => {
//                 if (task.order === undefined) {
//                     task.order = index
//                 }
//             })
//             this.renderTasks()
//         } else {
//             this.tasks = []
//         }
//     }

//     renderTasks() {
//         const sortedTasks = [...this.tasks].sort((a, b) => a.order - b.order)
//         //  [...this.tasks] - клон массива задач (сам в ахуе, нашел на форуме)

//         const tasksToRender = this.getFilteredTasks(sortedTasks)

//         this.containerToDoListTasks.innerHTML = ''

//         tasksToRender.forEach(task => {
//             this.createTaskElement(task)
//         })

//         if (this.dragDropManager) {
//             this.dragDropManager.init('.tasks-container');
//         }
//     }

//     attachCheckboxHandler(checkBoxChangeText, descriptionCloneElement, nameCloneElement) {
//         checkBoxChangeText.addEventListener('change', (event) => {
//             console.log('checkbox true') // отклакда
//             if (event.target.checked) {
//                 const listEl = event.currentTarget.closest(this.selectors.taskCard)
//                 if (listEl) {
//                     const idTask = Number(listEl.getAttribute('data-id-user'))
//                     const taskIndex = this.tasks.findIndex(task => task.id === idTask)
//                     if (taskIndex !== -1) {
//                         this.tasks[taskIndex].completed = true
//                     }
//                     this.saveTask()
//                     this.renderTasks()
//                 }
//                 descriptionCloneElement.classList.add('checkbox-text-change-active')
//                 nameCloneElement.classList.add('checkbox-text-change-active')
//             } else {
//                 const listEl = event.currentTarget.closest(this.selectors.taskCard)
//                 if (listEl) {
//                     const idTask = Number(listEl.getAttribute('data-id-user'))
//                     const taskIndex = this.tasks.findIndex(task => task.id === idTask)
//                     if (taskIndex !== -1) {
//                         this.tasks[taskIndex].completed = false
//                     }
//                     this.saveTask()
//                     this.renderTasks()
//                 }
//                 descriptionCloneElement.classList.remove('checkbox-text-change-active')
//                 nameCloneElement.classList.remove('checkbox-text-change-active')
//             }
//         })
//     }

//     dattachDeleteHandler(deleteTaskButton) {
//         deleteTaskButton.addEventListener('click', (event) => {
//             console.log('delete true') // отклакда
//             const listEl = event.currentTarget.closest(this.selectors.taskCard)
//             if (listEl) {
//                 const idTask = Number(listEl.getAttribute('data-id-user'))
//                 const taskIndex = this.tasks.findIndex(task => task.id === idTask)
//                 if (taskIndex !== -1) {
//                     this.tasks.splice(taskIndex, 1)
//                 }
//                 this.saveTask()
//             }
//         })
//     }

//     handleFilterChange(event) {
//         const targetButton = event.currentTarget
//         const filterType = targetButton.getAttribute('data-filter')

//         this.currentFilter = filterType

//         const filterElement = document.querySelectorAll('.filter')
//         filterElement.forEach(btn => {
//             btn.classList.remove('active')
//         })
//         targetButton.classList.add('active')

//         this.renderTasks()
//     }

//     bindEvents() {
//         if (this.buttonTaskAddElement) {
//             this.buttonTaskAddElement.addEventListener('click', this.openWindowAdd.bind(this))
//         }

//         if (this.changeTaskButtonElement) {
//             this.changeTaskButtonElement.addEventListener('click', this.changeTaskWindowOpen.bind(this))
//         }

//         if (this.buttonSaveTask) {
//             this.buttonSaveTask.addEventListener('click', this.addendumElement.bind(this))
//         }

//         if (this.modalsButtonCancel) {
//             this.modalsButtonCancel.addEventListener('click', () => {
//                 this.modalsOverlayAddTaskElement.classList.remove('active')
//                 document.body.classList.remove('modal-open');
//             })
//         }

//         if (this.modalsButtonClose) {
//             this.modalsButtonClose.addEventListener('click', () => {
//                 this.modalsOverlayAddTaskElement.classList.remove('active')
//                 document.body.classList.remove('modal-open');
//             })
//         }

//         const filterButtons = document.querySelectorAll('.filter')
//         filterButtons.forEach(button => {
//             button.addEventListener('click', (event) => {
//                 this.handleFilterChange(event)
//             })
//         })
//     }
// }

// new LocalStorage()