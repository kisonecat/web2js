program TEST;
var
  i : integer;
   
begin
   for i := 5 to 20 do begin
      case 2*i of
	17	 : writeln(17);
	24	 : writeln(24);
	20,22,26 : writeln(1000);
	18	 :
		  begin
		     writeln(18);
		     writeln(20);	       
	    end;
      end;
   end;
end.

