
+(function($){
    'use strict';

    var Switch = function(element, options){

        this.$input           = $(element);// input
        this.init(options);

    };

    Switch.VERSION  = '0.1.0';
    Switch.DEFAULTS = {
        switchClass: 'ly-switch-default',
        checked: false,
        disabled: false,
        trueText: 'ON',
        falseText: 'OFF',
        trueIconText: '',
        falseIconText: '',
        trueValue: '',
        falseValue: ''
    };

    Switch.prototype.init = function(options){
        this.options = $.extend({}, Switch.DEFAULTS, this.$input.data(), options);
        this.render();
        this.bindEvents();
    };
    Switch.prototype.render = function(){
        var _options = this.options;

        this.$wrap = $('<div>', {
            'role': 'switch',
            'class': _options.switchClass
        });

        if(_options.checked) this.$wrap.addClass('is-checked');
        if(_options.disabled) this.$wrap.addClass('is-disabled');

        this.$input.addClass('ly-switch__input').wrap(this.$wrap);
        // wrap()之后 this.$wrap 并不指向DOM中的标签
        this.$wrap = this.$input.closest('div');

        this.$text = $('<span>').addClass('ly-switch__text').text(_options.checked ? _options.trueText : _options.falseText);

        this.$icon = $('<span>').addClass('ly-switch__icon').text(_options.checked ? _options.trueIconText : _options.falseIconText);
        
        this.$wrap.append(this.$text, this.$icon);

    };
    Switch.prototype.bindEvents = function(){
        var _this = this;
        _this.$wrap.on('click', function(e){
            _this.options.disabled || _this.toggle();
        });
    };
    Switch.prototype.toggle = function(notTriggerEvent){
        var _options = this.options;
        if(_options.checked){
            this.uncheck(notTriggerEvent);
        }else{
            this.check(notTriggerEvent);
        }
    };
    Switch.prototype.check = function(notTriggerEvent){
        var e = $.Event('check.ly.switch');

        !notTriggerEvent && this.$input.trigger(e);

        if (this.options.checked || e.isDefaultPrevented()) return;

        this.$wrap.addClass('is-checked');
        this.$text.text(this.options.trueText);
        this.$icon.text(this.options.trueIconText);

        this.options.checked = true;
        this.$input.prop('checked', true);

        var e = $.Event('checked.ly.switch');

        !notTriggerEvent && this.$input.trigger(e);
    };
    Switch.prototype.uncheck = function(notTriggerEvent){
        var e = $.Event('uncheck.ly.switch');
        !notTriggerEvent && this.$input.trigger(e);

        if (!this.options.checked || e.isDefaultPrevented()) return;
        
        this.$wrap.removeClass('is-checked');
        this.$text.text(this.options.falseText);
        this.$icon.text(this.options.falseIconText);						

        this.options.checked = false;
        this.$input.prop('checked', false);
        
        var e = $.Event('unchecked.ly.switch');

        !notTriggerEvent && this.$input.trigger(e);
    };
    Switch.prototype.disable = function(notTriggerEvent){
        var e = $.Event('disable.ly.switch');
        !notTriggerEvent && this.$input.trigger(e);

        if(this.options.disabled || e.isDefaultPrevented()) return;

        this.$wrap.addClass('is-disabled');
        this.options.disabled = true;
        this.$input.prop('disabled', true);
        
        var e = $.Event('disabled.ly.switch');

        !notTriggerEvent && this.$input.trigger(e);
    };
    Switch.prototype.enable = function(notTriggerEvent){
        var e = $.Event('enable.ly.switch');
        !notTriggerEvent && this.$input.trigger(e);

        if(!this.options.disabled || e.isDefaultPrevented()) return;

        this.$wrap.removeClass('is-disabled');
        this.options.disabled = false;
        this.$input.prop('disabled', false);

        var e = $.Event('enabled.ly.switch');
        !notTriggerEvent && this.$input.trigger(e);
    };


    // Switch PLUGIN DEFINITION
    // =======================

    function Plugin(option) {
        var args = Array.prototype.slice.call(arguments, 0);
        return this.each(function () {
            var $this   = $(this);// input
            var obj    = $this.data('ly.switch');// 存储的实例对象
            
            var options = (typeof option == 'object' && option) ? option : {};
            if (!obj) $this.data('ly.switch', (obj = new Switch(this, options)));
            if (typeof option == 'string') obj[option](args[1]);
            
        });
    }

    var old = $.fn.lySwitch;

    $.fn.lySwitch             = Plugin;
    $.fn.lySwitch.Constructor = Switch;

    // Switch NO CONFLICT
    // =================

    $.fn.lySwitch.noConflict = function () {
        $.fn.lySwitch = old
        return this
    };

})(window.jQuery || window.Zepto);