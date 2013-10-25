/**
 * User ROLES Administration Javascript
 */
$(document).ready(function () {
    initContextMenus();
    var dt = $('#roles-table').dataTable();
    dt.fnSettings().aoDrawCallback.push({
        'fn': rolesTableDraw,
        'sName': 'user'
    });

    $('body').on('hidden.bs.modal', '.modal', function () {
        $(this).removeData('bs.modal');
    });

    $('.remove-selected').click(removeSelected);
});

var checkedRows = [];
var role_form_modal;
var contextMenuDocumentClick = false;

function initContextMenus() {
    var $wrapper = $('<div id="contextMenu" class="context-menu dropdown clearfix"></div>');
    var $menu = $('<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu" style="display:block;position:static;margin-bottom:5px;"></ul>');
    var $edit = $('<li><a tabindex="-1" href="#"><i class="icon-edit"></i> Edit</a></li>');
    var $remove = $('<li><a tabindex="-1" href="#"><i class="icon-remove red"></i> Remove</a></li>');
    $wrapper.css({position: 'absolute', display: 'none'});
    $menu.append($edit).append($remove);
    $wrapper.append($menu);
    $('body').append($wrapper);
    $wrapper.hide();
}
function rolesTableDraw(dt) {
    updateRowIdsAndNames();

    var $contextMenu = $("#contextMenu");
    var $rowClicked;

    $("body").unbind("contextmenu");
    $("body").on("contextmenu", "table tbody tr", function (e) {
        var first = $(this).find('td').eq(0);
        if (first.hasClass('dataTables_empty')) return false;
        $('.cmlabel,.cmlabel-divider').remove();
        $rowClicked = $(this);
        $contextMenu.css({
            display: "block",
            left: e.pageX,
            top: e.pageY
        });
        var name = $(this).attr('data-name'),
            $label = $('<li class="cmlabel text-center" role="presentation" class="dropdown-header"><strong>' + name + '</strong></li>'),
            $sep = $('<li class="divider cmlabel-divider"></li>');
        $contextMenu.find('ul').prepend($sep);
        $contextMenu.find('ul').prepend($label);
        return false;
    });

    $contextMenu.unbind("click");
    $contextMenu.on("click", "a", function () {
        var rid = $rowClicked.attr('data-rid'),
            text = $(this).text().replace(' ', ''),
            name = $rowClicked.attr('data-name');

        if (text == 'Add') {
            addNewRole();
        } else if (text == 'Edit') {
            editRole(rid, name);
        } else if (text == 'Remove') {
            removeRole(rid, name);
        }

        $('.cmlabel,.cmlabel-divider').remove();
        $contextMenu.hide();
    });

    if (!contextMenuDocumentClick) {
        // only perform this once to not interfere with dropdown clicks
        $(document).click(function () {
            $('.cmlabel,.cmlabel-divider').remove();
            $('.btn-group').removeClass('open');
            $contextMenu.hide();
        });
        contextMenuDocumentClick = true;
    }
}
function updateRowIdsAndNames() {
    $('#roles-table tbody tr').each(function () {
        var rid = null,
            name = null,
            el = $(this).find('[data-rid]'),
            el = $(this).find('[data-name]');

        rid = el.attr('data-rid');
        name = el.attr('data-name');
        el.removeAttr('data-rid');
        el.removeAttr('data-name');
        $(this).attr('data-rid', rid);
        $(this).attr('data-name', name);
    });

    $('.role-actions').each(function () {
        $(this).dropdown();
    });

    setTimeout(function () {
        initCheckAll();
    }, 250);
}
function initCheckAll() {
    $('.remove-selected').hide();
    var $header_check = $('#roles-table thead tr').find('input[type=checkbox]'),
        $rows = $('#roles-table tbody tr');

    $header_check.unbind('click');
    $header_check.click(function () {
        var header_checked = $(this).is(':checked');
        $.each($rows, function (ix, row) {
            var checkbox = $(row).find('input[type=checkbox]');

            if (header_checked) {
                if (!checkbox.is(':checked')) {
                    checkbox.prop('checked', true);
                    checkbox.parent().addClass('checked');
                }
            } else {
                if (checkbox.is(':checked')) {
                    checkbox.prop('checked', false);
                    checkbox.parent().removeClass('checked');
                }
            }
        });
        selectActions();
    });

    $.each($rows, function (ix, row) {
        var $row = $(row),
            checkbox = $row.find('input[type=checkbox]');
        checkbox.click(function () {
            selectActions();
        });
    });

    selectActions();
}
function selectActions() {
    var selected = getSelected(),
        total = $('#roles-table tbody tr').find('input[type=checkbox]').length,
        $header_check = $('#roles-table thead tr').find('input[type=checkbox]');

    if (selected.length == total) {
        $header_check.prop('checked', true);
        $header_check.parent().addClass('checked');
    } else {
        $header_check.prop('checked', false);
        $header_check.parent().removeClass('checked');
    }

    if (selected.length <= 0) {
        $('.remove-selected:visible').toggle(250);
    } else {
        $('.remove-selected:hidden').toggle(250);
    }
}
function getSelected() {
    checkedRows = [];
    $('#roles-table tbody tr').each(function () {
        var $checkbox = $(this).find('input[type=checkbox]');
        if ($checkbox.is(':checked')) {
            checkedRows.push($(this));
        }
    });
    return checkedRows;
}
function addNewRole() {
    role_form_modal = $('#roleModalAdd').modal({
        remote: ajax_url_add_role
    });
}
function editRole(rid, name) {
    role_form_modal = $('#roleModalEdit').modal({
        remote: ajax_url_edit_role + '/' + rid
    });
}
function removeRole(rid, name) {
    noty({
        text: 'Are you sure you want to remove the role "' + name + '"',
        type: 'confirm',
        layout: 'top',
        timeout: 2000,
        modal: true,
        buttons: [
            {
                addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                $noty.close();
                $.ajax({
                    url: ajax_url_remove_role + '/' + rid,
                    success: function (res) {
                        res = $.parseJSON(res);
                        if (res.success) {
                            noty({
                                type: 'success',
                                text: res.msg,
                                timeout: 3000
                            });
                        } else {
                            noty({
                                type: 'error',
                                text: res.msg,
                                timeout: 3000
                            });
                        }
                        refreshTable();
                    }
                });
            }
            },
            {
                addClass: 'btn btn-danger', text: 'Cancel', onClick: function ($noty) {
                $noty.close();
            }
            }
        ]
    });
}
function removeSelected() {
    var selected = getSelected(),
        ids = [],
        names = '';

    $.each(selected, function (ix, $row) {
        $row = $($row);
        var rid = $row.attr('data-rid'),
            name = $row.attr('data-name');
        ids.push(rid);
        if (names.length == 0) {
            names = '"' + name + '"';
        } else {
            names = names + ',"' + name + '"';
        }
    });

    noty({
        text: 'Are you sure you want to remove the ' + ids.length + ' roles ' + names + '?',
        type: 'confirm',
        layout: 'top',
        timeout: 2000,
        modal: true,
        buttons: [
            {
                addClass: 'btn btn-primary', text: 'Ok', onClick: function ($noty) {
                $noty.close();
                $.ajax({
                    url: ajax_url_remove_roles,
                    type: 'post',
                    data: {'role_ids': ids},
                    success: function (res) {
                        res = $.parseJSON(res);
                        if (res.success) {
                            noty({
                                type: 'success',
                                text: res.msg,
                                timeout: 3000
                            });
                        } else {
                            noty({
                                type: 'error',
                                text: res.msg,
                                timeout: 3000
                            });
                        }
                        refreshTable();
                    }
                });
            }
            },
            {
                addClass: 'btn btn-danger', text: 'Cancel', onClick: function ($noty) {
                $noty.close();
            }
            }
        ]
    });
}
function roleSavedCallback(res, status, new_role) {
    res = $.parseJSON(res);
    if (res.success) {
        noty({
            type: 'success',
            text: res.msg,
            timeout: 3000
        });
        if (role_form_modal) {
            $('.close-role-form').click();
        }
        role_form_modal = null;
        refreshTable();
    } else {
        noty({
            type: 'error',
            text: res.msg,
            timeout: 3000
        });
    }
}
function refreshTable() {
    var dt = $('#roles-table').dataTable();
    dt.fnDraw();
}