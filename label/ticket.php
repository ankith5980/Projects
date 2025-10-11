<link rel="stylesheet" href="styles.css">

<!-- Validation Script -->
<script>
function validateInput(input, min, max, fieldName) {
    if (input.value === '') {
        showError(`${fieldName} is required`);
        input.focus();
        return false;
    }
    if (isNaN(input.value) || input.value < min || input.value > max) {
        showError(`Invalid number. ${min}-${max} is allowed for ${fieldName}`);
        input.focus();
        return false;
    }
    return true;
}

function showError(message) {
    const msgElement = document.getElementById('msg');
    msgElement.textContent = message;
    msgElement.classList.add('error-message');
    setTimeout(() => {
        msgElement.classList.remove('error-message');
    }, 5000);
}
</script>

<script>
function submitForm() {
    const from_member = document.getElementById('from_member');
    const to_member = document.getElementById('to_member');
    const label_from = document.getElementById('label_from');
    const num_copies = document.getElementById('num_copies');

    // Clear any previous error messages
    document.getElementById('msg').textContent = '';

    // Required field validation
    if (!from_member.value) {
        showError('From Patron ID is required');
        from_member.focus();
        return false;
    }
    if (!to_member.value) {
        showError('To Patron ID is required');
        to_member.focus();
        return false;
    }

    // Series validation (1234..1299, A123..A500)
    if (isNaN(from_member.value)) {
        if (from_member.value.substring(0, 1) !== to_member.value.substring(0, 1)) {
            showError('To Patron ID must be in the same series as From Patron ID');
            to_member.focus();
            return false;
        }
    } else if (isNaN(to_member.value)) {
        showError('To Patron ID must be in the same series as From Patron ID');
        to_member.focus();
        return false;
    }

    // Validate label number
    if (!validateInput(label_from, 1, 24, 'Starting Label')) {
        return false;
    }

    // Validate number of copies
    if (!validateInput(num_copies, 1, 6, 'Number of Copies')) {
        return false;
    }

    // All validation passed, submit the form
    document.forms.form1.submit();
}
function setToLabel(that){
	that = document.getElementById('picker-'+that.value);
	var cl = document.getElementsByClassName('selected');
	if(cl.length) {
		cl[0].className = 'picker';
	}
	if(!that) return;
	that.className = 'picker selected';
	document.getElementById('label_from').value = that.innerHTML;
}

function pickFromlabel(that){
	var cl = document.getElementsByClassName('selected');
	if(cl.length) {
		cl[0].className = 'picker';
	}
	that.className = 'picker selected';
	document.getElementById('label_from').value = that.innerHTML;
}
function resetForm(){
	document.getElementById('msg').innerHTML='';
	document.forms.form1.from_member.value='';
	document.forms.form1.to_member.value='';
	document.getElementById('label_from').value = 1;
	document.getElementById('picker-1').classsName = 'picker selected';
	document.forms.form1.from_member.focus();
}
</script>
<div class="wrapper">

    <form name="form1" class="form1" autocomplete="off" method="post" action="ticket_validation.php">
        <h3>Print Labels</h3>
        <div id="msg" role="alert"><?php if(isset($_GET['msg'])) echo htmlentities($_GET['msg']) ?></div>
        
        <div class="form-section">
            <div class="form-group">
                <label for="from_member">From Patron ID</label>
                <div class="input-container">
                    <input type="text" 
                           id="from_member"
                           name="from_member" 
                           value="" 
                           autofocus="autofocus"
                           placeholder="Enter starting patron ID"/>
                    <div class="help-text">Enter the first patron ID in the series</div>
                </div>
            </div>
            
            <div class="form-group">
                <label for="to_member">To Patron ID</label>
                <div class="input-container">
                    <input type="text" 
                           id="to_member"
                           name="to_member" 
                           value=""
                           placeholder="Enter ending patron ID"/>
                    <div class="help-text">Must be in the same series as From Patron ID</div>
                </div>
            </div>
            
            <div class="form-group">
                <label for="label_from">Starting Label</label>
                <div class="input-container">
                    <input type="number" 
                           name="label_from" 
                           id="label_from"
                           min="1"
                           max="24" 
                           onkeyup="setToLabel(this)" 
                           onchange="setToLabel(this)" 
                           value="1"/>
                    <div class="help-text">Choose a number between 1-24 or click the grid below</div>
                </div>
            </div>
            
            <div class="form-group">
                <label for="num_copies">Number of Copies</label>
                <div class="input-container">
                    <input type="number" 
                           name="num_copies" 
                           id="num_copies"
                           min="1"
                           max="6" 
                           value="1"/>
                    <div class="help-text">Enter number of copies (1-6)</div>
                </div>
            </div>
            
            <div class="form-actions">
                <input type="button" value="Generate Labels" onclick="submitForm()"/>
                <input type="reset" value="Reset Form" onclick="resetForm()"/>
            </div>
        </div>
    </form>
	<div id="tpl_wrapper">
	<h3>Starting Label Display</h3>
	<table class="tpl" border="0" cellspacing="5" cellpadding="5">
		<?php 
			$cellNo=1;
			for($i=1;$i<=8;$i++){
				echo "<tr>";
				for($j=1;$j<=3;$j++){
					$c = $cellNo++;
					
					$ij = ($i==1 && $j==1)?'selected':'';
					echo "<td valign='top' align='center' onclick='pickFromlabel(this)' class='picker $ij' id='picker-$c'>$c</td>"; 
				}
				echo "</tr>";
			}
		?>
	</table></div>
</div>

