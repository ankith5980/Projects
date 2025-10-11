<?php
session_start();
header("Cache-control: private");

include "constants.php";

error_reporting(E_ERROR | E_PARSE);
?>
<!DOCTYPE html>
<html lang="en">
<head>

<title>SJC-Koha &rsaquo; Borrowers Ticket Print</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel="shortcut icon" href="/intranet-tmpl/prog/img/favicon.ico" type="image/x-icon" />
<link rel="stylesheet" type="text/css" href="/intranet-tmpl/lib/jquery/jquery-ui.css" />
<link rel="stylesheet" type="text/css" href="/intranet-tmpl/lib/bootstrap/bootstrap.min.css" />
<link rel="stylesheet" type="text/css" media="print" href="/intranet-tmpl/prog/css/print.css" />


   <link rel="stylesheet" type="text/css" href="/intranet-tmpl/prog/css/staff-global.css" />


<!-- local colors -->




<script type="text/javascript" src="/intranet-tmpl/lib/jquery/jquery.js"></script>
<script type="text/javascript" src="/intranet-tmpl/lib/jquery/jquery-ui.js"></script>
<script type="text/javascript" src="/intranet-tmpl/lib/shortcut/shortcut.js"></script>
<script type="text/javascript" src="/intranet-tmpl/lib/jquery/plugins/jquery.cookie.min.js"></script>
<script type="text/javascript" src="/intranet-tmpl/lib/jquery/plugins/jquery.highlight-3.js"></script>
<script type="text/javascript" src="/intranet-tmpl/lib/bootstrap/bootstrap.min.js"></script>
<script type="text/javascript" src="/intranet-tmpl/lib/jquery/plugins/jquery.validate.min.js"></script>



<!-- koha core js -->
<script type="text/javascript" src="/intranet-tmpl/prog/en/js/staff-global.js"></script>
<script type="text/javascript">
//<![CDATA[
$(document).ready(function(){
    jQuery.extend(jQuery.validator.messages, {
        required: _("This field is required."),
        remote: _("Please fix this field."),
        email: _("Please enter a valid email address."),
        url: _("Please enter a valid URL."),
        date: _("Please enter a valid date."),
        dateISO: _("Please enter a valid date (ISO)."),
        number: _("Please enter a valid number."),
        digits: _("Please enter only digits."),
        equalTo: _("Please enter the same value again."),
        maxlength: $.validator.format(_("Please enter no more than {0} characters.")),
        minlength: $.validator.format(_("Please enter at least {0} characters.")),
        rangelength: $.validator.format(_("Please enter a value between {0} and {1} characters long.")),
        range: $.validator.format(_("Please enter a value between {0} and {1}.")),
        max: $.validator.format(_("Please enter a value less than or equal to {0}.")),
        min: $.validator.format(_("Please enter a value greater than or equal to {0}."))
    });
});
//]]>
</script>



<script type="text/javascript">
    //<![CDATA[
        var MSG_BASKET_EMPTY = _("Your cart is currently empty");
        var MSG_RECORD_IN_BASKET = _("This item is already in your cart");
        var MSG_RECORD_ADDED = _("This item has been added to your cart");
        var MSG_NRECORDS_ADDED = _(" item(s) added to your cart");
        var MSG_NRECORDS_IN_BASKET = _("already in your cart");
        var MSG_NO_RECORD_SELECTED = _("No item was selected");
        var MSG_NO_RECORD_ADDED = _("No item was added to your cart");
        var MSG_CONFIRM_DEL_BASKET = _("Are you sure you want to empty your cart?");
        var MSG_CONFIRM_DEL_RECORDS = _("Are you sure you want to remove the selected items?");
        var MSG_IN_YOUR_CART = _("Items in your cart: ");
        var MSG_NON_RESERVES_SELECTED = _("One or more selected items cannot be reserved.");
    //]]>
    </script>
<script type="text/javascript" src="/intranet-tmpl/prog/en/js/basket.js"></script>


<script type="text/javascript" src="/intranet-tmpl/prog/en/js/localcovers.js"></script>
<script type="text/javascript">
//<![CDATA[
var NO_LOCAL_JACKET = _("No cover image available");
//]]>
</script>


<!-- RFID changes Start -->
<!--<script type="text/javascript" src="/intranet-tmpl/prog/en/lib/yui/rfid/iAjax.js"></script> 
<script type="text/javascript" src="/intranet-tmpl/prog/en/lib/yui/rfid/rfid.js"></script>-->
<!-- RFID changes End -->
</head>
<body id="circ_circulation-home" class="circ">
<div id="header" class="navbar navbar-static-top">
    <div class="navbar-inner">
        <ul id="toplevelmenu" class="nav">
            <li><a href="borrowersticket.php">Borrowers Ticket Print</a></li>
            
	    
        </ul>
        <ul class="nav pull-right"><li></li>
        </ul>
    </div>
    <!--<div id="cartDetails">Your cart is empty.</div>-->
</div>

<div class="gradient">
<h1 id="logo"><a href="/cgi-bin/koha/mainpage.pl"></a></h1><!-- Begin Circulation Resident Search Box -->

<!-- /header_search -->
</div><!-- /gradient -->
<!-- End Circulation Resident Search Box -->


<div id="breadcrumbs"><a href="/cgi-bin/koha/mainpage.pl">Home</a> &rsaquo; Borrowers Ticket Print</div>

<div id="doc" class="yui-t7">
  
   <div id="bd">
	
<?php 

include "ticket.php"; 

?>

   </div>

</div>


</body>
</html>
