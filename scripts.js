let activities = [];
        // agregar una actividad
        function addActivity(event) {
            event.preventDefault();
            const activityName = document.getElementById('activityName').value;
            const startDate = new Date(document.getElementById('startDate').value);
            const endDate = new Date(document.getElementById('endDate').value);
            const activityDescription = document.getElementById('activityDescription').value;
            const activityType = document.getElementById('activityType').value;
            activities.push({
                text: activityName,
                start_date: startDate,
                end_date: endDate,
                description: activityDescription,
                type: activityType
            });
            renderGantt();
            renderCSV();
        }
        function renderGantt() {
            document.getElementById('gantt_container').innerHTML = '';
            gantt.config.buttons_right = [];
            gantt.init("gantt_container");
            gantt.parse({data: activities});
            // Cambiar colores por tipo
            gantt.templates.task_class = function(start, end, task) {
                if (task.type === 'principal') {
                    return 'gantt_project';
                } else {
                    return 'gantt_task';
                }
            };
            gantt.config.lightbox.sections = [
                { name: "description", height: 70, map_to: "description", type: "textarea", focus: true },
                { name: "time", height: 72, type: "duration", map_to: "auto" },
                { name: "activityType", height: 23, map_to: "type", type: "select", options: [
                    { key: 'principal', label: 'Principal' },
                    { key: 'subtarea', label: 'Subtarea' }
                ]},
                { name: "buttons", map_to: "buttons", type: "buttons", items: ["delete", { text: "Save", type: "button", name: "save" }] }
            ];
            // Deshabilitar todos los eventos de ratón
            gantt.config.readonly = true;
            gantt.render();
            gantt.attachEvent("onLightbox", function (id) {
                gantt.attachEvent("onLightboxSave", function (id, task, is_new) {
                    var typeSelect = document.querySelector(".dhx_cal_light [name=type]");
                    if (typeSelect) {
                        task.type = typeSelect.value;
                    }
                    return true;
                });
                return true;
            });
        }
        function renderCSV() {
            const csvColumns = ["text", "start_date", "end_date", "description", "type"];
            const csvRows = activities.map(activity => {
                return csvColumns.map(column => {
                    let value = activity[column];
                    if (value instanceof Date) {
                        value = value.toISOString().slice(0, 10);
                    }
                    return value;
                }).join(",");
            });
            const csvContent = "data:text/csv;charset=utf-8," + csvColumns.join(",") + "\n" + csvRows.join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.getElementById('downloadCSV');
            link.setAttribute("href", encodedUri);
        }
        function exportGanttImage() {
            html2canvas(document.getElementById('gantt_container'), {
                onrendered: function(canvas) {
                    var link = document.createElement('a');
                    link.download = 'gantt.png';
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                }
            });
        }
        document.getElementById('activityForm').addEventListener('submit', addActivity);
        document.getElementById('exportImage').addEventListener('click', exportGanttImage);